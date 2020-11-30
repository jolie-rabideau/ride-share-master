<template>
  <v-container>
    <div>
      <h4 class="display-1">Account Information</h4>

      <v-data-table
        class="elevation-1"
        v-bind:headers="headers"
        v-bind:items="accounts">
        <template v-slot:item="{ item }">
          <tr v-bind:class="itemClass(item)">
            <td>{{ item.email }}</td>
            <td>{{ item.firstName }}</td>
            <td>{{ item.lastName }}</td>
            <td>{{ item.phoneNumber }}</td>
          </tr>
        </template>
      </v-data-table>

      <v-snackbar v-model="snackbar.show">
        {{ snackbar.text }}
        <v-btn color="blue" text @click="snackbar.show = false">
          Close
        </v-btn>
      </v-snackbar>
    </div>
  </v-container>
</template>

<script>
export default {
  name: "Account",

  data: function() {
    return {
      headers: [
        { text: "Email", value: "email" },
        { text: "First", value: "firstName" },
        { text: "Last", value: "lastName" },
        { text: "Phone Number", value: "phoneNumber" },
      ],
      accounts: [],

      snackbar: {
        show: false,
        text: ""
      }
    };
  },

  mounted: function() {
    this.$axios.get("/users").then(response => {
      this.users = response.data.map(user => ({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
      }));
    });
  },

  methods: {
    showSnackbar(text) {
      this.snackbar.text = text;
      this.snackbar.show = true;
    },

    itemClass(item) {
      const currentUser = this.$store.state.currentUserState;
      if (currentUser && currentUser.id === item.id) {
        return "currentUser";
      }
    },
  }
};
</script>

<style>
.currentAccount {
  background: lightcoral;
}
</style>
