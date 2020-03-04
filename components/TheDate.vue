<template>
  <div class="app">
    <h5 class="info">Дата добавления</h5>
    <h5>
    <button class="btn-circle" @click.prevent="setDayBefore">-</button>
    {{ getDate() }}
    <button class="btn-circle" @click.prevent="setNextDay">+</button>
    </h5>
  </div>
</template>

<script>
  import {mapActions, mapGetters} from "vuex";
  import moment from 'moment';
  export default {
    name: "TheDate",
    data: () => ({
      dateValue: new Date,
    }),
    computed: mapGetters({
      date: 'date/getDate'
    }),
    async fetch ({ store }) {
      await store.dispatch('date/loadDate')
    },
    methods: {
      getDate(){
        this.dateValue = this.date
        return moment(this.dateValue).format('DD.MM.YYYY');
      },

      setNextDay() {
        let newDate = moment(this.dateValue).add(1, 'day');
        this.$store.dispatch('date/setDate', newDate)
      },

      setDayBefore() {
        let newDate = moment(this.dateValue).subtract(1, 'day');
        this.$store.dispatch('date/setDate', newDate)
      }
    },
  }

</script>

<style scoped lang="css">
  .app {
    padding: 20px;
    margin: 20px;
  }
  .btn-circle {
    width: 38px;
    height: 38px;
    border-radius: 19px;
    text-align: center;
    padding-left: 0;
    padding-right: 0;
    font-size: 16px;
    background: none;
    color: black;
  }
  .btn-circle:hover {background: #707981;
    transition: 1s;}
  .info {
    margin-left: 15px;
  }
</style>
