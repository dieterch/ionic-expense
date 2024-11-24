<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <ion-header collapse="fade">
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-menu-button size="small"></ion-menu-button>
          </ion-buttons>
          <ion-title slot="start">
            <span @click="goToTrips">{{ ltripname }}</span>
          </ion-title>
          <ion-buttons slot="end">
            <ion-button shape="round" size="small">
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
      <!--ion-item v-for="expense in expenses"-->
      <ion-grid>
        <ion-row v-for="expense in filteredexpenses">
          <ion-col size="1.2">
            <h1><i :class="mdiIconText(expense.category.icon)"></i></h1>
          </ion-col>
          <ion-col size="1.6" class="date">
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
          <ion-col class="left">
            <ion-label>
              <h2>{{ expense.description }}</h2>
              <p>Payed by {{ expense.user.name }}</p>
            </ion-label>
          </ion-col>
          <ion-col size="2"> {{ expense.amount }} € </ion-col>
          <ion-col size="1.1">
            <ion-buttons>
              <ion-button color="dark" size="small">
                <ion-icon slot="icon-only" :icon="trashBin"></ion-icon>
              </ion-button>
            </ion-buttons>
          </ion-col>
        </ion-row>
      </ion-grid>
      <!--/ion-item-->
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
  IonItem,
  IonThumbnail,
  IonLabel,
  IonList,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
} from "@ionic/vue";
import {
  addCircleOutline,
  addCircle,
  bugOutline,
  bug,
  documentOutline,
  document,
  reloadOutline,
  reload,
  trashBinOutline,
  trashBin,
  createOutline,
  create,
} from "ionicons/icons";
import { useIFetch } from "@/composables/UseIonosfetch";
const $ifetch = useIFetch();

import { ref, computed, onMounted } from "vue";
import { CapacitorCookies } from "@capacitor/core";
import { useRouter } from "vue-router";
const router = useRouter();

interface TripUser {
  user: {
    name: string;
  };
}

interface Trip {
  id: string;
  startDate: Date;
  name: string;
  users: TripUser[];
  expenses: [];
}

interface Expense {
  date: Date;
  description: string;
  amount: Number;
  user: {
    name: string;
  };
  trip: {
    name: string;
  };
  category: {
    icon: string;
  };
}

const trips = ref<Trip[]>();
const ltripname = ref("");
const selectedTrip = ref<Trip>();
const selectedTripId = ref("");
const filteredexpenses = ref<Expense[]>();
// const debug = ref(false);
//const expenses = ref<Expense[]>();
const mdiIconText = (name: string) => {
  return "mdi " + name;
};

// Fetch Data on Mount
onMounted(async () => {
  trips.value = await $ifetch.get("/api/trips");
  const temp = await CapacitorCookies.getCookies();
  if (temp["selectedTripId"]) {
    selectedTripId.value = temp.selectedTripId;
    // console.log(
    //   "selectedTripId exists in cookies, selectedTripId.value=",
    //   selectedTripId.value
    // );
    if (trips.value) {
      selectedTrip.value = trips.value.find(
        (item: Trip) => item.id === selectedTripId.value
      );
    }
    if (selectedTrip.value) {
      ltripname.value = selectedTrip.value.name;
      fetchFilteredExpenses();
    }
    // console.log("selectedTrip", selectedTrip.value, "selectedTripId: ",selectedTripId.value)
  } else {
    console.log(
      "selectedTripId does not exist in cookies, selectedTripId.value=",
      selectedTripId.value
    );
  }
});

const fetchFilteredExpenses = async () => {
  try {
    filteredexpenses.value = await $ifetch.post("/api/tripexpenses", {
      // data: { id: "9bb38019-873f-4bf4-8a35-ac4dffb49bf7" },
      data: { id: selectedTripId.value },
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching filtered Expenses", error);
  }
};

const goToTrips = () => {
  router.push("/trips");
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

.date {
  padding-top: 16px;
  align-items: start;
}

.left {
  padding-left: 10px;
  justify-content: left;
  text-align: left;
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
