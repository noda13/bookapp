<template>
  <div>
    <v-text-field v-model="search" label="Search for books" @keyup.enter="fetchBooks" />
    <v-data-table :items="books">
      <template v-slot:item.thumbnail="{ item }" >
        <v-img 
          :src="item.thumbnail" 
          :aspect-ratop="16/9" 
          height="9vw" 
          min-height="100px"
          width="16vw" 
          min-width="160px" 
          class="ma-0 pa-0">
        </v-img>
      </template>
    </v-data-table>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'

interface Book {
  thumbnail: string
  title: string
  subtitle: string
  publishedDate: string
  description: string
}

const search: Ref<string> = ref('')
const books: Ref<Book[]> = ref([])

const fetchBooks = async () => {
  books.value = []
  const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${search.value}`)
  books.value = response.data.items.map((book: any) => {
    return {
      thumbnail: book.volumeInfo.imageLinks.smallThumbnail,
      title: book.volumeInfo.title,
      subtitle: book.volumeInfo.subtitle,
      publishedDate: book.volumeInfo.publishedDate,
      description: book.volumeInfo.description,
    }
  })
}
</script>