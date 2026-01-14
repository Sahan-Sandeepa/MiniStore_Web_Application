export function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h4 className="mb-3 font-semibold text-gray-900 dark:text-gray-200">
        {title}
      </h4>
      <ul className="space-y-2">{children}</ul>
    </div>
  );
}

export function FooterLink({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <a
        href={to}
        className="hover:text-gray-900 dark:hover:text-white transition"
      >
        {children}
      </a>
    </li>
  );
}
