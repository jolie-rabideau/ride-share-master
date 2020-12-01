<template>
  <v-container>
    <div>
      <h4 class="display-1">Account</h4>
      
      <v-data-table
        class="elevation-1"
        v-bind:headers="headers"
        v-bind:items="users"
      >
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
  name: "Users",
  data: function() {
    return {
      headers: [
        { text: "Email", value: "email" },
        { text: "First", value: "firstName" },
        { text: "Last", value: "lastName" },
        { text: "Phone Number", value: "phoneNumber" }
      ],
      users: [],
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
        firstName: user.first_name,
        lastName: user.last_name,
        phoneNumber: user.phone_number
      }));
    });
  },
  methods: {
    // Display a snackbar message.
    showSnackbar(text) {
      this.snackbar.text = text;
      this.snackbar.show = true;
    },
    // Calculate the CSS class for an item
    itemClass(item) {
      const currentUser = this.$store.state.currentUser;
      if (currentUser && currentUser.id === item.id) {
        return "currentUser";
      }
    }
  }
};
</script>

<style>
.currentUser {
  background: lightcoral;
}
</style>
