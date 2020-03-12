<template>
  <div>
    <div v-show="getCurrMonthDeffer().length < 1">
      <button id="btnDeffer" @click.prevent="isHidden = !isHidden" class="btn btn-outline-dark"  >
        Отложить деньжат
      </button>
      <div  v-if="!isHidden">
        <form  @submit.prevent="onSubmitDeffer()">
          <div class="form-group">
            <input id="deffer" v-model="deffer.sum"  type="number" class="form-control" placeholder="Сумма">
          </div>
          <button id="submit" v-if="getCurrMonthDeffer().length < 1" type="submit" class="btn btn-outline-dark">
            Отложить
          </button>
        </form>
      </div>
    </div>
    <div class="def" v-if="getCurrMonthDeffer().length > 0">
      Планируем отложить: {{getTotalDeffer()}}
    </div>
  <div class="all">
    <div class="sumToday" v-if="expensesBeforeToday() > 0">
      <h4 >Доступная сумма на сегодня : {{  expensesBeforeToday() }}UAH</h4>
    </div>
    <div class="sumTodayMinus" v-if="expensesBeforeToday() <= 0">
      <h4 >Доступная сумма на сегодня : {{  expensesBeforeToday() }}UAH</h4>
    </div>
    <validation-observer ref="signUnpForm" v-slot="{ handleSubmit }" class="container h-100vh" tag="div">
      <form class="decor" @submit.prevent="handleSubmit(onSubmitIncome)">
        <div class="form-left-decoration"></div>
        <div class="form-right-decoration"></div>
        <div class="circle"></div>
        <div class="form-inner">
          <nuxt-link :to="{ name:'expenses' }" class="navbar-brand" exact exact-active-class="active">
            Добавить расход
          </nuxt-link>
          <nuxt-link :to="{ name:'incomes' }" class="navbar-brand" exact exact-active-class="active">
            Добавить доход
          </nuxt-link>
          <validation-provider v-slot="{ errors, classes }" name="Категория дохода" rules="required" tag="div" class="form-group">
            <input
              id="Категория дохода"
              v-model="income.whence"
              :class="classes"
              name="Категория дохода"
              type="text"
              class="form-control"
              placeholder="Категория дохода">
            <div class="invalid-feedback">
              <strong>{{ errors[0] }}</strong>
            </div>
          </validation-provider>
          <validation-provider v-slot="{ errors, classes }" name="Сумма" rules="required" tag="div" class="form-group">
            <input
              id="Сумма"
              v-model="income.sum"
              :class="classes"
              name="Сумма"
              type="number"
              class="form-control"
              placeholder="Сумма">
            <div class="invalid-feedback">
              <strong>{{ errors[0] }}</strong>
            </div>
          </validation-provider>
          <input type="submit" value="Сохранить">
        </div>
      </form>
    </validation-observer>
    <h4 v-if="getCurrMonthAndDayIncomes().length > 0">
      Список доходов зa день:
    </h4>
        <ol>
          <li v-for="income of getCurrMonthAndDayIncomes()">
            {{ income.date }} - {{ income.whence }} - {{ income.sum }} UAH
            <button @click.prevent="onDelete(income)" class="close">
              x
            </button>
          </li>
        </ol>
    <h3 v-if="getTotalToday() !== 0">Cумма доходов за день - {{ getTotalToday() }} UAH </h3>
  </div>
  </div>

</template>


<script>
  import {mapGetters} from "vuex"
  import moment from "moment";
  export default {
    name: 'incomes',
    data: () => ({
      income: {
        whence: '',
        sum: '',
        date: null,
      },
      deffer: {
        sum: '',
        date: null,
      },
      isHidden: true,
    }),
    computed:mapGetters({
        expenses: 'expenses/getExpenses',
        date: 'date/getDate',
        deffers: 'deffer/getDeffers'
      }),
      async fetch({store}) {
        await store.dispatch('expenses/loadExpenses')
        await store.dispatch('deffer/loadDeffers')
      },
      async asyncData({$axios}) {
      let incomes = []
      try {
        incomes = await $axios.$get('/incomes')
      } catch (e) {
        console.log(e)
      }
      return {incomes}
    },
    methods: {
      async onDelete(income) {
        const message = `Удалить запись ${income.whence}?`
        if (window.confirm(message)) {
          try {
            await this.$axios.$delete(`/incomes/${income.id}`)
            const index = this.incomes.findIndex(u => u.id === income.id)
            this.incomes.splice(index, 1)
          } catch (e) {
            console.log(e)
          }
        }
      },
      async onSubmitIncome() {
        if (await this.$refs.signUnpForm.validate()) {
          try {
            this.income.date = moment(this.date).format('DD.MM.YYYY');
            const newIncome = await this.$axios.$post('/incomes', this.income)
            this.incomes.push(newIncome)
          } catch (e) {
            console.log(e)
          }
        }
      },
      onSubmitDeffer() {
        try {
          this.deffer.date = moment(this.date).format('DD.MM.YYYY');
          this.$store.dispatch('deffer/setDeffer', this.deffer);
        } catch (e) {
          console.log(e)
        }
      },
      getCurrMonthIncomes () {
        const CurrMonthIncomes = this.incomes.filter(income =>
          moment(income.date, "DD.MM.YYYY").isSame(moment(this.date, "DD.MM.YYYY"), 'month')
        )
        return CurrMonthIncomes
      },
      getTotal: function () {
        let totalSum = 0;
        this.getCurrMonthIncomes().forEach(i => totalSum += +i.sum)
        return totalSum
      },
      toDay () {
        let totalSum = 0
        const CurrMonthIncomes = this.expenses.filter(expense =>
          moment(expense.date, "DD.MM.YYYY").isSame(moment(), 'month'))
        CurrMonthIncomes.forEach(i => totalSum += +i.sum)
        return Math.round(( this.getTotal()-totalSum)  / moment().daysInMonth())
      },
      getCurrMonthAndDayIncomes () {
        const CurrMonthAndDayIncomes = this.getCurrMonthIncomes().filter(income =>
          moment(income.date, "DD.MM.YYYY").isSame(moment(this.date, "DD.MM.YYYY"), 'day')&&
          moment(income.date, "DD.MM.YYYY").isSame(moment(this.date, "DD.MM.YYYY"), 'month')
        )
        return CurrMonthAndDayIncomes
      },
      getTotalToday () {
        let totalSum = 0;
        this.getCurrMonthAndDayIncomes().forEach(i => totalSum += +i.sum)
        return totalSum
      },
    getSum(total, el)
    {
      return total + el.sum;
    },
      getCurrMonthDeffer () {
        let currentDeffer =  this.deffers.filter(d =>
          moment(d.date, "DD.MM.YYYY").isSame(moment(this.date, "DD.MM.YYYY"), 'month'));
        return currentDeffer
      },
      getTotalDeffer () {
        let totalDeffer = 0;
        this.getCurrMounyhDeffer().forEach((i => totalDeffer += +i.sum))
        return totalDeffer
      },
    getDailyMoney() {
      let totalSum = 0;
      let totalDeffer = 0;
      this.getCurrMonthIncomes().forEach(i => totalSum += +i.sum);
      this.getCurrMonthDeffer().forEach(i => totalDeffer += +i.sum);
      totalSum -= totalDeffer;
      return Math.round(totalSum / moment(this.date).daysInMonth())
    },
    getCurrMonthExpenses() {
      const CurrMonthExpenses = this.expenses.filter(expense =>
        moment(expense.date, "DD.MM.YYYY").isSame(moment(this.date, "DD.MM.YYYY"), 'month')
      )
      return CurrMonthExpenses
    },
      expensesBeforeToday() {
        const CurrMonthIncomes = this.getCurrMonthIncomes();
        const ExpensesBefore = this.getCurrMonthExpenses().filter(expense =>
          moment(expense.date, "DD.MM.YYYY").isBefore(moment(this.date, "DD.MM.YYYY"), 'date') ||
          moment(expense.date, "DD.MM.YYYY").isSame(moment(this.date, "DD.MM.YYYY"), 'date'))
        let totalSumIncomes = 0   ;
        const ExpenseBeforeOfDay = this.getDailyMoney() * moment(this.date).date();
        ExpensesBefore.forEach(i => totalSumIncomes += +i.sum)
        return ExpenseBeforeOfDay - totalSumIncomes;
      }
    }
  }

  </script>

  <style scoped lang="css">

  .all {
    width: auto;
    min-width: 550px;
    height: auto;
    position: absolute;
    top: 35%;
    left: 40%;
    margin: -125px 0px 0 -125px;
    margin-bottom: 50px;
  }
  .navbar-brand {
    color: black;
  }
  input {
    opacity: 0.7;
    font-weight: bold;
  }
  ul {
    margin-top: 15px;
  }
  strong {
    font-size: large;
  }
  button {
    font-weight: bolder;
  }
  .sumToday {
    padding: 5px;
    margin-bottom: 20px;
    background: #ECE9E0;
    border-radius: 10px;
    text-align: center;
    color: black;
  }
  .sumTodayMinus {
    padding: 5px;
    margin-bottom: 20px;
    background: red;
    border-radius: 10px;
    text-align: center;
    color: white;
  }

  .decor {
    position: relative;
    max-width: 500px;
    margin: 0px auto 0;
    background:white;
    border-radius: 30px;
  }
  .form-left-decoration,
  .form-right-decoration {
    content: "";
    position: absolute;
    width: 50px;
    height: 20px;
    background: #707981;
    border-radius: 20px;
  }
  .form-left-decoration {
    bottom: 60px;
    left: -30px;
  }
  .form-right-decoration {
    top: 60px;
    right: -30px;
  }
  .form-left-decoration:before,
  .form-left-decoration:after,
  .form-right-decoration:before,
  .form-right-decoration:after {
    content: "";
    position: absolute;
    width: 50px;
    height: 20px;
    border-radius: 30px;
    background: white;
  }
  .form-left-decoration:before {top: -20px;}
  .form-left-decoration:after {
    top: 20px;
    left: 10px;
  }
  .form-right-decoration:before {
    top: -20px;
    right: 0;
  }
  .form-right-decoration:after {
    top: 20px;
    right: 10px;
  }
  .circle {
    position: absolute;
    bottom: 80px;
    left: -55px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: white;
  }
  .form-inner {padding: 50px;}
  .form-inner input,
  .form-inner textarea {
    display: block;
    width: 100%;
    padding: 0 20px;
    margin-bottom: 10px;
    background: #E9EFF6;
    line-height: 40px;
    border-width: 0;
    border-radius: 20px;
    font-family: 'Roboto', sans-serif;
  }
  .form-inner input[type="submit"] {
    margin-top: 30px;
    background: #707981;
    border-bottom: 4px solid #707981;
    color: white;
    font-size: 14px;
  }
  .form-inner h3 {
    margin-top: 0;
    font-family: 'Roboto', sans-serif;
    font-weight: 500;
    font-size: 24px;
    color: #707981;
  }
  #btnDeffer {
    margin-left: 30px;
    width: 220px;
  }
  #deffer {
    margin-top: 20px;
    margin-left: 30px;
    width: 220px;
  }
  #submit {
    margin-left: 90px;
  }
  .def {
    margin-left: 30px;
    font-weight: bold;
  }
</style>
