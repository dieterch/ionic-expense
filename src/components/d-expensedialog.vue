<template>
    <v-dialog v-model="ldialog" width="500px">
      <v-card>
        <v-card-title>{{
          modeis("add") ? "Add Expense" : "Update Expense"
        }}</v-card-title>
        <v-card-text>
          <v-form ref="expenseForm" v-model="isFormValid" lazy-validation>
            <v-row dense>
              <!-- Description Input -->
              <v-col cols="12" md="8" sm="12">
                <v-text-field
                  density="compact"
                  v-model="lexpense.description"
                  label="Title*"
                  placeholder="Brief description of the expense"
                  required
                  :rules="[rules.required('Description')]"
                ></v-text-field>
              </v-col>
  
              <!-- Category Dropdown -->
              <v-col cols="12" md="4" sm="6">
                <v-select
                  density="compact"
                  v-model="lexpense.categoryId"
                  :items="dialogcategories"
                  label="Category"
                  item-title="name"
                  item-value="id"
                  required
                  :rules="[rules.required('Category')]"
                >
                  <template v-slot:item="{ props, item }">
                    <v-list-item v-bind="props">
                      <v-avatar :icon="item.raw.icon"></v-avatar>
                    </v-list-item>
                  </template>
                </v-select>
              </v-col>
  
              <!-- Currency Dropdown -->
              <v-col cols="12" md="3" sm="4">
                <v-select
                  density="compact"
                  v-model="lexpense.currency"
                  :items="currencies"
                  item-title="symbol"
                  item-value="symbol"
                  label="Currency"
                  required
                  :rules="[rules.required('Currency')]"
                ></v-select>
              </v-col>
  
              <!-- Amount Input -->
              <v-col cols="12" md="9" sm="12">
                <v-text-field
                  density="compact"
                  v-model="lexpense.amount"
                  type="number"
                  label="Amount"
                  required
                  :rules="[rules.required('Amount')]"
                ></v-text-field>
              </v-col>
  
              <!-- User Dropdown -->
              <v-col cols="12" md="6" sm="12">
                <v-select
                  density="compact"
                  v-model="lexpense.userId"
                  :items="props.selectedTrip?.users || []"
                  item-title="user.name"
                  item-value="user.id"
                  label="Select User"
                  required
                  :rules="[rules.required('User')]"
                ></v-select>
              </v-col>
  
              <!-- Date Input -->
              <v-col cols="12" md="6" sm="12">
                <v-date-picker
                  density="compact"
                  v-model="lexpense.date"
                  label="Expense Date"
                  required
                  :rules="[rules.required('Date')]"
                ></v-date-picker>
              </v-col>
            </v-row>
            <small class="text-caption text-medium-emphasis"
              >*indicates required field</small
            >
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            v-if="modeis('add')"
            text="Add"
            @click="handleForm('POST')"
            :disabled="!isFormValid"
          />
          <v-btn
            v-if="modeis('update')"
            text="Update"
            @click="handleForm('PUT')"
            :disabled="!isFormValid"
          />
          <v-btn text="Close" @click="closeDialog" />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>


<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import type { Expense, Category, SelectedTrip } from "@/types";

import { useIFetch } from "@/composables/UseIonosfetch";

// Fetch utility composable
const ifetch = useIFetch();

const currencies = [
  { name: "USD", symbol: "$", factor: 0.92 },
  { name: "EUR", symbol: "€", factor: 1.0 }, // Bezugswährung
];

// Props and Emits
const props = defineProps<{
  dialog: boolean; // Prop explicitly typed as boolean
  mode: "add" | "update";
  item: Partial<Expense>;
  selectedTrip: SelectedTrip | null;
}>();

const emit = defineEmits<{
  (e: "refresh"): void;
  (e: "dialog", value: boolean): void;
}>();

// Reactive States
const isFormValid = ref(false);
const dialogcategories = ref<Category[]>([]);
const lexpense = ref<Partial<Expense>>({
  amount: null,
  currency: "€",
  date: new Date(),
  // location: "",
  description: "",
});

// Computed Property for Dialog Visibility
const ldialog = computed<boolean>({
  get: () => props.dialog,
  set: (value: boolean) => emit("dialog", value),
});

// Helper to determine mode
const modeis = (e: string) => props.mode === e;

// Form Validation Rules
const rules = {
  required: (field: string) => (value: any) => !!value || `${field} is required`,
};

// Fetch Initial Data
onMounted(async () => {
  dialogcategories.value = await ifetch.get<Category[]>("/api/categories");

  if (props.mode === "update" && props.item) {
    lexpense.value = {
      ...props.item,
      date: props.item.date ? new Date(props.item.date) : new Date(),
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
    date: new Date(),
    description: "",
    // location: "",
  };
};

// Handle Form Submission
const handleForm = async (method: "POST" | "PUT") => {
  if (!isFormValid.value) return;

  const payload = {
    ...lexpense.value,
    amount: parseFloat(lexpense.value.amount?.toString() || "0"),
    date: lexpense.value.date ? new Date(lexpense.value.date) : undefined,
    trip: { connect: { id: props.selectedTrip?.id } },
    user: { connect: { id: lexpense.value.userId } },
    category: { connect: { id: lexpense.value.categoryId } },
  };

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
