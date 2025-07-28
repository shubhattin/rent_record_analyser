export const PAGE_TITLES = {
  '/': ['', 'text-2xl font-bold text-primary'],
  '/add': ['Add Record', 'text-xl font-semibold text-green-600 dark:text-green-400'],
  '/list': ['Edit Records', 'text-xl font-semibold text-blue-600 dark:text-blue-400'],
  '/admin': ['Admin Panel', 'text-xl font-semibold text-red-600 dark:text-red-400']
} as const;

export const usePageTitles = () => {
  const route = useRoute();

  const currentPageTitle = computed(() => {
    const routePath = route.path as keyof typeof PAGE_TITLES;
    return PAGE_TITLES[routePath] || ['Unknown Page', 'text-xl font-semibold'];
  });

  return {
    PAGE_TITLES,
    currentPageTitle
  };
};
