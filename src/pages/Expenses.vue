<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <ion-header collapse="fade">
        <!-- Expense Dialog -->
        <d-ion-expensedialog
          :dialog="isExpenseDialogOpen"
          :key="isExpenseDialogOpen as unknown as PropertyKey"
          :mode="emode"
          :item="eitem"
          :selectedTrip="selectedTrip"
          @refresh="fetchFilteredExpenses"
          @dialog="(e: boolean) => (isExpenseDialogOpen = e)"
        />
        <!-- Toolbar -->
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-menu-button size="small"></ion-menu-button>
          </ion-buttons>
          <ion-title slot="start">
            <span @click="goToTrips">{{ ltripname }}</span>
          </ion-title>
          <ion-buttons slot="end">
            <ion-button shape="round" size="small" @click="clickplus">
              <ion-icon slot="icon-only" :icon="addCircle"></ion-icon>
            </ion-button>
            <ion-button shape="round" size="small">
              <ion-icon slot="icon-only" :icon="document"></ion-icon>
            </ion-button>
            <ion-button shape="round" size="small">
              <ion-icon slot="icon-only" :icon="bug"></ion-icon>
            </ion-button>
            <ion-button shape="round" size="small">
              <ion-icon slot="icon-only" :icon="reload"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>

      <!-- Expense List -->
      <ion-grid>
        <ion-row v-for="expense in filteredexpenses" :key="expense.id">
          <ion-col size="1.2" class="icon">
            <h1><i :class="mdiIconText(expense.category.icon)"></i></h1>
          </ion-col>
          <ion-col size="1.9" class="date">
            <ion-label>
              <h3>
                {{
                  new Date(expense.date).toLocaleDateString("de-AT", {
                    day: "numeric",
                    month: "numeric",
                    year: "2-digit",
                  })
                }}
              </h3>
            </ion-label>
          </ion-col>
          <ion-col class="content">
            <ion-label>
              <h2>{{ expense.description }}</h2>
              <p>Payed by {{ expense.user.name }}</p>
            </ion-label>
          </ion-col>
          <ion-col size="2" class="amount"> {{ expense.amount }} € </ion-col>
          <ion-col size="2.2" class="righticon">
            <ion-buttons>
              <ion-button
                color="dark"
                size="small"
                @click="deleteExpense(expense)"
              >
                <ion-icon slot="icon-only" :icon="trashBin"></ion-icon>
              </ion-button>
              <ion-button color="dark" size="small">
                <ion-icon slot="icon-only" :icon="create"></ion-icon>
              </ion-button>
            </ion-buttons>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonButtons,
  IonButton,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonCol,
  IonRow,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  IonLabel
} from "@ionic/vue";
import {
  addCircle,
  bug,
  document,
  reload,
  trashBin,
  create,
} from "ionicons/icons";

import { ref, onMounted } from "vue";
import { onIonViewWillEnter } from "@ionic/vue";
import { useRouter } from "vue-router";
import { CapacitorCookies } from "@capacitor/core";
import type { Trip, SelectedTrip, Expense } from "@/types";
import { useIFetch } from "@/composables/UseIonosfetch";
import dIonExpensedialog from "@/components/d-ion-expensedialog.vue";
// import dExpensedialog from "../components/d-expensedialog.vue";

// Fetch utility composable
const ifetch = useIFetch();

// Component States
const isExpenseDialogOpen = ref<boolean>(false);
const emode = ref<"add" | "update">("add");
const eitem = ref<Partial<Expense>>({});
const trips = ref<Trip[]>([]);
const ltripname = ref("");
const selectedTrip = ref<Trip | null>(null);
const selectedTripId = ref<string>("");
const filteredexpenses = ref<Expense[]>([]);

// Navigation
const router = useRouter();

const mdiIconText = (name: string) => `mdi ${name}`;


// Switch trip based on cookie
const switchtrip = async () => {
  try {
    trips.value = await ifetch.get<Trip[]>("/api/trips");
    const cookies = await CapacitorCookies.getCookies();
    if (cookies["selectedTripId"]) {
      selectedTripId.value = cookies.selectedTripId;
      selectedTrip.value = trips.value.find((trip) => trip.id === selectedTripId.value) || null;
      
      if (selectedTrip.value) {
        ltripname.value = selectedTrip.value.name;
        await fetchFilteredExpenses();
      }
    }
  } catch (error) {
    console.error("Error fetching trips:", error);
  }
};

// Fetch initial data on mount
onMounted(switchtrip);
onIonViewWillEnter(switchtrip);

// Fetch filtered expenses
const fetchFilteredExpenses = async () => {
  try {
    const response = await ifetch.post<Expense[]>("/api/tripexpenses", {
      data: { id: selectedTripId.value },
      headers: { "Content-Type": "application/json" },
    });
    filteredexpenses.value = response;
  } catch (error) {
    console.error("Error fetching filtered expenses:", error);
  }
};

// Handle adding a new expense
const clickplus = () => {
  emode.value = "add";
  eitem.value = {};
  isExpenseDialogOpen.value = true;
};

// Navigate to trips page
const goToTrips = () => {
  router.push("/trips");
};

// Delete an expense
const deleteExpense = async (item: Expense) => {
  try {
    await ifetch.del("/api/expenses", {
      data: { id: item.id },
      headers: { "Content-Type": "application/json" },
    });
    await fetchFilteredExpenses();
  } catch (error) {
    console.error("Error deleting expense:", error);
  }
};
</script>

<style scoped>
ion-grid {
  --ion-grid-padding: 0px;
  --ion-grid-column-padding: 5px;
}

ion-col {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  border-bottom: solid 1px rgba(228, 228, 228, 0.491);
  /*
  nobackground-color: #ffffff;
  border-bottom: solid 1px;
  nocolor: #000000; */
}

ion-title {
  padding-left: 50px;
  justify-content: left;
  text-align: left;
}

.icon {
  padding-top: 0px;
  align-items: start;
}

.date {
  padding-top: 20px;
  align-items: start;
}

.content {
  padding-top: 20px;
  padding-left: 10px;
  align-items: start;
  justify-content: left;
  text-align: left;
}

.amount {
  padding-top: 20px;
  align-items: start;
}

.righticon {
  padding-top: 10px;
  align-items: start;
}

#container {
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;
  color: #8c8c8c;
  margin: 0;
}

#container a {
  text-decoration: none;
}
</style>