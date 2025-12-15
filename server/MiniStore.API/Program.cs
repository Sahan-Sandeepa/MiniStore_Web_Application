using MiniStore.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using MiniStore.Core.Interfaces;
using MiniStore.Infrastructure.Repositories;
using MiniStore.Infrastructure.Services;
using StackExchange.Redis;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

// Load environment variables from .env 
DotNetEnv.Env.Load(@"../../.env");

var builder = WebApplication.CreateBuilder(args);

// Controllers & Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Repositories & services
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<RedisCacheService>();

// User & token services
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<ITokenService, TokenService>();

builder.Services.AddAuthorization();

// Register ElasticsearchService using IConfiguration from builder
builder.Services.AddSingleton<ElasticsearchService>(sp =>
{
    var config = sp.GetRequiredService<IConfiguration>();
    return new ElasticsearchService(config);
});

var connectionString = Environment.GetEnvironmentVariable("DB_CONNECTION")
                       ?? throw new Exception("DB_CONNECTION is missing in .env");

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString)
);

var redisConnection = Environment.GetEnvironmentVariable("REDIS_CONNECTION")
                      ?? "localhost:6379";

builder.Services.AddSingleton<IConnectionMultiplexer>(sp =>
    ConnectionMultiplexer.Connect(redisConnection)
);

// Elasticsearch
var esUri = Environment.GetEnvironmentVariable("ELASTIC_URI") ?? "http://localhost:9200";


var jwtKey = Environment.GetEnvironmentVariable("JWT_KEY")
             ?? throw new Exception("JWT_KEY is missing in .env");

var jwtIssuer = Environment.GetEnvironmentVariable("JWT_ISSUER") ?? "MiniStoreAPI";
var jwtAudience = Environment.GetEnvironmentVariable("JWT_AUDIENCE") ?? "MiniStoreUsers";

var key = Encoding.UTF8.GetBytes(jwtKey);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidIssuer = jwtIssuer,

        ValidateAudience = true,
        ValidAudience = jwtAudience,

        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),

        ValidateLifetime = true
    };
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy
                .WithOrigins("http://localhost:3000")
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();
        });
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await AdminSeeder.SeedAdminAsync(db);
}

// Middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowFrontend");
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();