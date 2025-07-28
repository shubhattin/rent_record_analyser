import type { User } from '../../server/utils/auth';
import { computed } from 'vue';

const USER_INFO_STATE_KEY = 'auth_user' as const;
export function useAuth() {
  const user = useState<User | null>(USER_INFO_STATE_KEY, () => null);
  const isLoggedIn = computed(() => !!user.value);
  const isAdmin = computed(() => user.value?.user_type === 'admin');

  return {
    user_info: user,
    isLoggedIn,
    isAdmin
  };
}
