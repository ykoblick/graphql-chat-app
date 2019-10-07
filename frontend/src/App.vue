<template>
  <div id="app" class="container" style="padding-top: 100px">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card">
          <div class="card-body">
            <!-- Note - conditional display if user is present in the app -->
            <div class="row" v-if="entered">
              <div class="col-md-12">
                <div class="card">
                  <div class="card-header">
                     {{username}}
                    
                    Chatbox</div>
                  <div class="card-body">
                    <!-- messages  here -->

                    <dl v-for="(chat, id) in chats" :key="id">
                      <dt>{{ chat.from }}</dt>
                      <dd>{{ chat.message }}</dd>
                    </dl>

                    <hr />

                    <input
                      type="text"
                      class="form-control"
                      placeholder="Type your message..."
                      v-model="message"
                      @keyup.enter="sendMessage"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="row" v-else>
              <div class="col-md-12">
                <form method="post" @submit.prevent="enterChat">
                  <div class="form-group">
                    <div class="input-group">
                      <input
                        type="text"
                        class="form-control"
                        placeholder="Enter your username"
                        v-model="username"
                      />
                      <div class="input-group-append">
                        <button class="btn btn-primary" @click="enterChat">Enter</button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  CHATS_QUERY,
  SEND_MESSAGE_MUTATION,
  MESSAGE_SENT_SUBSCRIPTION
} from "@/graphql";

export default {
  name: "app",
  data() {
    return {
      username: "",
      message: "",
      entered: false
    };
  },
  /*
  We add a new apollo object, then within the apollo object, we define the GraphQL query to fetch all messages. This makes use of the CHATS_QUERY query


In addition to just fetching the messages, we now define a subscribeToMore object, which contains our subscription. To update the messages in realtime, we define a updateQuery, which accepts the previous chats data and the data that was passed along with the subscription. So all we have to do is merge the new data to the existing one and return them as the updated messages.

  */
  apollo: {
    chats: {
      query: CHATS_QUERY,
      subscribeToMore: {
        document: MESSAGE_SENT_SUBSCRIPTION,
        updateQuery: (previousData, { subscriptionData }) => {
          return {
            chats: [...previousData.chats, subscriptionData.data.messageSent]
          };
        }
      }
    }
  },
  methods: {
    enterChat() {
      this.entered = !!this.username != "";
    },

    /* We define the sendMessage(), which makes use of the mutate() available on this.$apollo (from the Vue Apollo plugin). We use the SEND_MESSAGE_MUTATION mutation (which we’ll create shortly) and pass along the necessary arguments (username and message). */
    async sendMessage() {
      const message = this.message;
      this.message = "";

      await this.$apollo.mutate({
        mutation: SEND_MESSAGE_MUTATION,
        variables: {
          from: this.username,
          message
        }
      });
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
