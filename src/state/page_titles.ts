export type PageTitleEntry = [title: string, titleClassName: string];

export const PAGE_TITLES: Record<string, PageTitleEntry> = {
  '/': ['', ''],
  '/add': ['Add New Entry', 'text-xl font-bold text-indigo-800 dark:text-blue-300'],
  '/list': ['', ''],
  '/reset_pass': ['Reset Password', 'text-xl font-bold text-indigo-800 dark:text-blue-300']
};

export function getPageTitle(pathname: string): PageTitleEntry {
  return PAGE_TITLES[pathname] ?? ['', ''];
}
