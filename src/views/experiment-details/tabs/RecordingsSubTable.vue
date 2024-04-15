<template>    
  <base-table
    :headers="headers"
    :items="usefulData"
    :show-expand="false"
    :hide-footer="true"
  >  
    <template #participants="{ item }">            
      <v-chip-group column>
        <v-chip
          v-for="(person, index) in item.participants"
          :key="index"
        >
          {{ person.name }} {{ person.surname }}
        </v-chip>
      </v-chip-group>   
    </template>
  </base-table>
</template>
      
<script>
import BaseTable from '@/components/base/BaseTable.vue';
import IndexedDB from '@/storage/IndexedDB';

export default {
  name: 'ModalitiesTable',
  components: {
    BaseTable,
  },
  props: {            
    dataToDisplay: {
      type: Object,
      default: () => ({}),
    },
  },            
  data() {
    return {
      usefulData: [],
      headers: [
        { text: 'Channel', value: 'channel_name', sortable: false },                                                  
        { text: 'Participants', value: 'participants', sortable: false },
      ],          
    };
  },
  created() {
      this.onCreation();
  },     
  methods: {
      onCreation() {                
          var filteredData = [];  
          this.dataToDisplay.data.forEach(obj =>{
              filteredData.push({ ...obj, id: this.dataToDisplay.id, channel_name: obj.channel.name });
          });    
          this.usefulData = filteredData;                 
      },             
    async loadFileFromIndexedDB(key) {             
      const fileData = await IndexedDB.readFileFromIndexedDB(key);
      if (fileData) {
        return fileData;            
      } else {
        console.log('No file found in IndexedDB.');
      }
    },
    async downloadFile(allInfo) {            
      var id = allInfo.id.toString()+'_';
      var key = id + allInfo.index.toString();            
      var fileLoaded = await this.loadFileFromIndexedDB(key);          
      const fileUrl = URL.createObjectURL(fileLoaded.file);          
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = '';           
      link.click();          
    },
  },      
};
</script>
      