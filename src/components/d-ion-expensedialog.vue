<template>
  <ion-modal :is-open="ldialog" @did-dismiss="closeDialog">
    <ion-header>
      <ion-toolbar>
        <ion-title>
          {{ modeis("add") ? "Add Expense" : "Update Expense" }}
        </ion-title>
        <ion-buttons slot="end">
          <ion-button @click="closeDialog">Close</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <form @submit.prevent>
        <!--ion-list-->
        <ion-grid>
          <ion-row>
            <ion-col>
              <!-- Description Input -->
              <ion-item>
                <ion-label position="fixed"><b>Title</b></ion-label>
                <ion-input
                  v-model="lexpense.description"
                  placeholder="Brief description of the expense"
                  required
                ></ion-input>
                <ion-note slot="helper">Description is required.</ion-note>
              </ion-item>
            </ion-col>
          </ion-row>

          <ion-row>
            <ion-col>
              <!-- User Dropdown -->
              <ion-item>
                <ion-label position="fixed"><b>User</b></ion-label>
                <ion-select v-model="lexpense.userId" placeholder="User">
                  <ion-select-option
                    v-for="user in props.selectedTrip?.users || []"
                    :key="user.user.id"
                    :value="user.user.id"
                  >
                    {{ user.user.name }}
                  </ion-select-option>
                </ion-select>
                <ion-note slot="helper">User is required.</ion-note>
              </ion-item>
            </ion-col>
          </ion-row>

          <ion-row>
            <!-- Category Dropdown -->
            <ion-col>
              <ion-item>
                <ion-label position="fixed"><b>Category</b></ion-label>
                <ion-select
                  v-model="lexpense.categoryId"
                  placeholder="Category"
                >
                  <ion-select-option
                    v-for="category in dialogcategories"
                    :key="category.id"
                    :value="category.id"
                  >
                    <h1><i :class="mdiIconText(category.icon)"></i></h1>
                    {{ category.name }}
                  </ion-select-option>
                </ion-select>
                <ion-note slot="helper">Category is required.</ion-note>
              </ion-item>
            </ion-col>
          </ion-row>

          <ion-row>
            <ion-col>
              <!-- Amount Input -->
              <ion-item>
                <ion-label position="fixed"><b>Amount</b></ion-label>
                <ion-input
                  v-model="lexpense.amount as string"
                  type="number"
                  placeholder="Enter Amount"
                  required
                ></ion-input>
                <ion-note slot="helper">Amount is required.</ion-note>
              </ion-item>

              <!-- Currency Dropdown -->
              <ion-item>
                <ion-label position="fixed"><b>Currency</b></ion-label>
                <ion-select
                  v-model="lexpense.currency"
                  placeholder="Select Currency"
                >
                  <ion-select-option
                    v-for="currency in currencies"
                    :key="currency.symbol"
                    :value="currency.symbol"
                  >
                    {{ currency.name }}
                  </ion-select-option>
                </ion-select>
                <ion-note slot="helper">Currency is required.</ion-note>
              </ion-item>
            </ion-col>
          </ion-row>

          <!-- Date Input -->
          <ion-item>
            <ion-label position="fixed" style="align-items: start"
              ><b>Date</b></ion-label
            >
            <!--ion-datetime-button
              v-model="lexpense.date as string"
              display-format="MM/DD/YYYY"
              placeholder="Select Date"
              required
            ></ion-datetime-button-->
            <ion-datetime-button
              datetime="date"
              v-model="lexpense.date as string"
              display-format="MM/DD/YYYY"
              placeholder="Select Date"
              required
            ></ion-datetime-button>
            <ion-modal :keep-contents-mounted="true" aria-hidden="false">
              <ion-datetime id="date"></ion-datetime>
            </ion-modal>
            <ion-note slot="helper">Date is required.</ion-note>
          </ion-item>
          <!--/ion-list-->
        </ion-grid>
      </form>
    </ion-content>

    <ion-footer>
      <ion-toolbar>
        <ion-buttons slot="end">
          <ion-button
            :disabled="!isFormValid"
            @click="handleForm(modeis('add') ? 'POST' : 'PUT')"
          >
            {{ modeis("add") ? "Add" : "Update" }}
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-footer>
  </ion-modal>
</template>

<script setup lang="ts">
import {
  IonButtons,
  IonButton,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonModal,
  IonFooter,
  IonList,
  IonItem,
  IonNote,
  IonDatetime,
  IonDatetimeButton,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonInput,
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/vue";
import { ref, computed, onMounted } from "vue";
import type { Expense, Category, SelectedTrip } from "@/types";
import { useIFetch } from "@/composables/UseIonosfetch";

// Fetch utility composable
const ifetch = useIFetch();

const currencies = [
  { name: "USD", symbol: "$", factor: 0.92 },
  { name: "EUR", symbol: "€", factor: 1.0 },
];

const mdiIconText = (name: string) => `mdi ${name}`;

// Props and Emits
const props = defineProps<{
  dialog: boolean;
  mode: "add" | "update";
  item: Partial<Expense>;
  selectedTrip: SelectedTrip | null;
}>();

const emit = defineEmits<{
  (e: "refresh"): void;
  (e: "dialog", value: boolean): void;
}>();

// Reactive States
// const isFormValid = ref(false);
const dialogcategories = ref<Category[]>([]);
const lexpense = ref<Partial<Expense>>({
  amount: null,
  currency: "€",
  location: "",
  date: new Date().toISOString(),
  description: "",
});

// Computed Property for Dialog Visibility
const ldialog = computed<boolean>({
  get: () => props.dialog,
  set: (value: boolean) => emit("dialog", value),
});

// Validation Function
const isFieldValid = (field: any) => {
  return field !== null && field !== undefined && field !== "";
};

// Computed Property for Form Validation
const isFormValid = computed(() => {
  return (
    isFieldValid(lexpense.value.description) &&
    isFieldValid(lexpense.value.categoryId) &&
    isFieldValid(lexpense.value.currency) &&
    isFieldValid(lexpense.value.amount) &&
    isFieldValid(lexpense.value.userId) &&
    isFieldValid(lexpense.value.date)
  );
});

// Helper to determine mode
const modeis = (e: string) => props.mode === e;

// Fetch Initial Data
onMounted(async () => {
  dialogcategories.value = await ifetch.get<Category[]>("/api/categories");

  if (props.mode === "update" && props.item) {
    lexpense.value = {
      ...props.item,
      date: props.item.date
        ? new Date(props.item.date).toISOString()
        : new Date().toISOString(),
    };
  } else {
    resetForm();
  }
});

// Reset Form
const resetForm = () => {
  lexpense.value = {
    amount: null,
    currency: "€",
    location:"",
    date: new Date().toISOString(),
    description: "",
  };
};

// Handle Form Submission
const handleForm = async (method: "POST" | "PUT") => {
  if (!isFormValid.value) return;

  const payload = {
    ...lexpense.value,
    amount: parseFloat(lexpense.value.amount?.toString() || "0"),
    date: lexpense.value.date
      ? new Date(lexpense.value.date).toISOString()
      : undefined,
    trip: { connect: { id: props.selectedTrip?.id } },
    user: { connect: { id: lexpense.value.userId } },
    category: { connect: { id: lexpense.value.categoryId } },
  };
  delete payload.categoryId
  delete payload.userId

  try {
    await ifetch.request("/api/expenses", {
      method,
      data: payload,
      headers: { "Content-Type": "application/json" },
    });

    resetForm();
    emit("refresh");
    closeDialog();
  } catch (error) {
    console.error("Error submitting form:", error);
  }
};

// Close Dialog
const closeDialog = () => {
  resetForm();
  emit("dialog", false);
};
</script>


<style scoped>

</style>
