// frontend/src/graphql.js

import gql from 'graphql-tag'

//Query
export const CHATS_QUERY = gql`
   query ChatsQuery {
     chats {
       id
       from
       message
     }
   }
   `

//Mutation
export const SEND_MESSAGE_MUTATION = gql`
   mutation SendMessageMutation($from: String!, $message: String!) {
     sendMessage(
       from: $from,
       message: $message
     ) {
       id
       from
       message
     }
   }
   `

//Subscription
export const MESSAGE_SENT_SUBSCRIPTION = gql`
subscription MessageSentSubscription {
  messageSent {
    id
    from
    message
  }
}
`