<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <ion-header collapse="fade">
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-menu-button size="small"></ion-menu-button>
          </ion-buttons>
          <ion-buttons slot="end">
            <ion-button shape="round" size="small">
              <ion-icon slot="icon-only" :icon="addCircle"></ion-icon>
            </ion-button>
            <ion-button shape="round" size="small">
              <ion-icon slot="icon-only" :icon="bug"></ion-icon>
            </ion-button>
            <ion-button shape="round" size="small">
              <ion-icon slot="icon-only" :icon="reload"></ion-icon>
            </ion-button>
          </ion-buttons>
          <ion-title>Users</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-grid>
        <ion-row v-for="user in users">
          <ion-col class="left">
            <ion-label>
              <h2>{{ user.name }}</h2>
            </ion-label>
          </ion-col>
          <ion-col class="left">
            <ion-label>
              <p>{{ user.role }}</p>
            </ion-label>
          </ion-col>
          <ion-col size="3">
            <ion-label>
              <p>{{ user.expenses.length }} Expenses</p>
            </ion-label>
          </ion-col>
          <ion-col size="3">
            <ion-label>
              <p>{{ user.trips.length }} Trips</p>
            </ion-label>
          </ion-col>
          <ion-col size="2">
            <ion-buttons>
              <ion-button size="small">
                <ion-icon slot="icon-only" :icon="trashBin"></ion-icon>
              </ion-button>
              <ion-button size="small">
                <ion-icon slot="icon-only" :icon="create"></ion-icon>
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
  create
} from "ionicons/icons";
import { useIFetch } from "@/composables/UseIonosfetch";
const { get, post, put, del, request } = useIFetch();
import { ref, computed, onMounted } from "vue";

interface User {
    name: string;
    email: string;
    role: string;
    expenses: [];
    trips: [];
}

interface Trip {
  startDate: Date;
  name: string;
  users: User[];
  expenses: [];
}

const users = ref<User[]>();
const mdiIconText = (name: string) => {
  return "mdi " + name;
};

// Fetch Data on Mount
onMounted(async () => {
  users.value = await get("/api/users");
});
</script>

<style scoped>
ion-grid {
  --ion-grid-padding: 0px;
  --ion-grid-column-padding: 10px;
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

.left {
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
