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
  watch: {
    dataToDisplay: {
      immediate: true,
      handler(newValue) {
        this.onCreation(newValue);
      },
    },
  },     
  methods: {
      onCreation() {                
          var filteredData = [];  
          this.dataToDisplay.data.forEach(obj =>{
              filteredData.push({ ...obj, id: this.dataToDisplay.id, channel_name: obj.channel.name });
          });    
          this.usefulData = filteredData;                 
      },             
  },      
};
</script>