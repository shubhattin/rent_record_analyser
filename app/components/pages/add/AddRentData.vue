<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';
import { useAuth } from '~/composables/useAuth';
import { get_utc_date, normaliseDate, MONTH_NAMES } from '~/tools/date';
import { Label } from '~/components/ui/label';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '~/components/ui/alert-dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const { isAdmin } = useAuth();
const { $client } = useNuxtApp();

const todaysDate = new Date();
const currentMonth = todaysDate.getMonth() + 1;
const currentYear = todaysDate.getFullYear();

const getTodaysDate = () => {
  const prefixZeros = (n: number) => `${n < 10 ? '0' : ''}${n}`;
  return `${currentYear}-${prefixZeros(currentMonth)}-${prefixZeros(todaysDate.getDate())}`;
};

// Form state
const date = ref(getTodaysDate());
const month = ref((currentMonth === 1 ? 12 : currentMonth - 1).toString());
const year = ref((currentMonth === 1 ? currentYear - 1 : currentYear).toString());
const amount = ref('');
const rentType = ref<'rent' | 'electricity'>('rent');

// UI state
const amountInputElement = ref<HTMLInputElement | null>(null);
const confirmDialogOpen = ref(false);
const isLoading = ref(false);
const isSuccess = ref(false);
const successData = ref<any>(null);

// tRPC mutation
const submitDataMutation = async () => {
  const amountNum = parseInt(amount.value);
  if (
    !date.value ||
    date.value === '' ||
    !amount.value ||
    amount.value === '' ||
    isNaN(amountNum) ||
    amountNum === 0
  )
    return;

  isLoading.value = true;

  try {
    const data = await $client.data.add_data.mutate({
      data: {
        rent_type: rentType.value,
        date: get_utc_date(date.value),
        amount: amountNum,
        month: get_utc_date(`${year.value}-${month.value}-1`)
      }
    });

    isSuccess.value = true;
    successData.value = data;
  } catch (error) {
    console.error('Error submitting data:', error);
  } finally {
    isLoading.value = false;
    confirmDialogOpen.value = false;
  }
};

const submitForm = (e: Event) => {
  e.preventDefault();
  const amountNum = parseInt(amount.value);
  if (
    !date.value ||
    date.value === '' ||
    !amount.value ||
    amount.value === '' ||
    isNaN(amountNum) ||
    amountNum === 0
  )
    return;
  confirmDialogOpen.value = true;
};

const resetForm = async () => {
  date.value = getTodaysDate();
  month.value = currentMonth.toString();
  year.value = currentYear.toString();
  amount.value = '';
  isSuccess.value = false;
  successData.value = null;

  await nextTick();
  if (amountInputElement.value) {
    amountInputElement.value.focus();
  }
};

onMounted(() => {
  if (amountInputElement.value) {
    amountInputElement.value.focus();
  }
});

const yearOptions = computed(() => [
  (currentYear - 1).toString(),
  currentYear.toString(),
  (currentYear + 1).toString()
]);

const monthName = computed(() => MONTH_NAMES[parseInt(month.value) - 1]);
</script>

<template>
  <div>
    <!-- Success State -->
    <div v-if="isSuuccess && successData?.status === 'success'" class="space-y-3">
      <NuxtLink
        to="/"
        class="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium"
      >
        <Icon name="lucide:home" class="h-4 w-4" />
        Home Page
      </NuxtLink>

      <div class="font-semibold">
        Successfully Added Record of ₹ {{ amount }} dated {{ normaliseDate(date) }}.
      </div>

      <Button variant="secondary" @click="resetForm" class="gap-2">
        <Icon name="lucide:plus" class="h-4 w-4" />
        Add More
      </Button>
    </div>

    <!-- Form -->
    <form v-else @submit="submitForm" class="space-y-4">
      <!-- Rent Type Selection (Admin only) -->
      <div v-if="isAdmin" class="space-y-3">
        <Label>Type</Label>
        <div class="flex space-x-6">
          <RadioGroup v-model="rentType" class="flex items-center justify-center space-x-4">
            <div class="flex items-center space-x-2">
              <RadioGroupItem id="rent" value="rent" />
              <Label for="rent">
                <Icon name="lucide:home" class="size-4" />
                Rent
              </Label>
            </div>
            <div class="flex items-center space-x-2">
              <RadioGroupItem id="electricity" value="electricity" />
              <Label for="electricity">
                <Icon name="lucide:zap" class="size-4" />
                Electricity
              </Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <!-- Date Input -->
      <div class="space-y-2">
        <Label for="date">Date</Label>
        <Input id="date" v-model="date" type="date" required />
      </div>

      <!-- Month Selection -->
      <div class="space-y-2">
        <Label for="month">Month</Label>
        <select
          v-model="month"
          id="month"
          class="focus:border-primary focus:ring-primary dark:focus:border-primary dark:focus:ring-primary block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base text-gray-900 shadow-sm transition-colors focus:ring-2 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
        >
          <option
            v-for="(monthName, index) in MONTH_NAMES"
            :key="index"
            :value="(index + 1).toString()"
            class="bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100"
          >
            {{ monthName }}
          </option>
        </select>
      </div>

      <!-- Year Selection -->
      <div class="space-y-2">
        <Label for="year">Year</Label>
        <select
          v-model="year"
          id="year"
          class="focus:border-primary focus:ring-primary dark:focus:border-primary dark:focus:ring-primary block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base text-gray-900 shadow-sm transition-colors focus:ring-2 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
        >
          <option
            v-for="yearOption in yearOptions"
            :key="yearOption"
            :value="yearOption"
            class="bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100"
          >
            {{ yearOption }}
          </option>
        </select>
      </div>

      <!-- Amount Input -->
      <div class="space-y-2">
        <Label for="amount">Amount</Label>
        <Input
          id="amount"
          ref="amountInputElement"
          v-model="amount"
          type="number"
          placeholder="Amount"
          required
          :min="100"
        />
      </div>

      <!-- Submit Button -->
      <Button type="submit" :disabled="isLoading" class="gap-2 font-bold">
        <Icon name="lucide:plus" class="h-4 w-4" />
        Add Record
      </Button>
    </form>

    <!-- Confirmation Dialog -->
    <AlertDialog v-model:open="confirmDialogOpen">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure to Add?</AlertDialogTitle>
          <AlertDialogDescription as-child>
            <div class="flex items-center gap-2">
              <span>₹ {{ amount }}</span>
              <Icon name="lucide:arrow-right" class="h-4 w-4" />
              <span class="font-bold">{{ monthName }} {{ year }}</span>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction @click="submitDataMutation" :disabled="isLoading">
            <Icon v-if="isLoading" name="lucide:loader-2" class="mr-2 h-4 w-4 animate-spin" />
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>
