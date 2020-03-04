<template>
  <div>
    <h4>Таблица всех транзакций, сгрупированных по месяцам</h4>
  <table>
    <thead>
      <tr>
        <th>Период</th>
        <th>Сумма доходов </th>
        <th>Сумма расходов </th>
        <th>Сальдо </th>
      </tr>
    </thead>

    <tbody>
      <template v-for="totalSum of rows">
        <tr>
          <td>
            <button @click="onShowInformation(totalSum)">
              <div v-if="totalSum.isHidden" variant="outline-success" v-b-tooltip.hover="{ variant: 'info' }"
                   title="Нажми меня и получишь полную информацию за период.">
                +
              </div>
              <div v-else variant="outline-success" v-b-tooltip.hover="{ variant: 'info' }"
                   title="Скрыть информацию за период.">
                -
              </div>
            </button>
            {{totalSum.month}}
          </td>
          <td>{{totalSum.value}}</td>
          <td>{{totalSum.totalExpenses}}</td>
          <td> {{totalSum.saldo}}</td>
        </tr>
        <tr class="details" v-show='!totalSum.isHidden'>
          <td/>
          <td>
            <table class="details" v-if="totalSum.totalIncomes !== 0">
              <thead>
              <tr>
                <th>Дата дохода</th>
                <th>Категория</th>
                <th>Сумма</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="currentIncome of totalSum.currentIncomes">
                <td>{{currentIncome.date}}</td>
                <td>{{currentIncome.whence}}</td>
                <td>{{currentIncome.sum}}</td>
              </tr>
              </tbody>
            </table>
          </td>
          <td>
            <table class="details" v-if="totalSum.totalExpenses !== 0">
              <thead>
              <tr>
                <th>Дата расхода</th>
                <th>Категория</th>
                <th>Сумма</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="currentExpense of totalSum.currentExpenses">
                <td>{{currentExpense.date}}</td>
                <td>{{currentExpense.name}}</td>
                <td>{{currentExpense.sum}}</td>
              </tr>
              </tbody>
            </table>
          </td>
          <td/>
        </tr>
      </template>
      <tr>
        <td colspan="4" style="text-align:right">Общая сумма накоплений: {{getTotalSaldo()}} UAH</td>
      </tr>
    </tbody>
  </table>
  </div>
</template>

<script>

  import {mapGetters} from "vuex";
  import moment from "moment";

  export default {
    layout: 'withOutDate',
    data: () => ({
      month: '',
      isHidden: true,
      rows: []
    }),
    computed: mapGetters({
      expenses: 'expenses/getExpenses',
      incomes: 'incomes/getIncomes'
    }),
    created() {
      this.rows = this.getTotalMounthesIncomes();
    },
    async fetch({store}) {
      await store.dispatch('expenses/loadExpenses')
      await store.dispatch('incomes/loadIncomes')
    },
    methods: {
      getCurrMonthExpenses() {
        const CurrMonthExpenses = this.expenses.filter(expense =>
          moment(expense.date, "DD.MM.YYYY").isSame(moment(), 'month'))
        return CurrMonthExpenses
      },
      createArrofMonthExpenses() {
        let CurrMonthExpenses = []
        for (let m = 0; m < 12; m++) {
          CurrMonthExpenses.push(this.expenses.filter(expense =>
            moment(expense.date, "DD.MM.YYYY").isSame(moment().month(m), 'month'))
          )
        }
        return CurrMonthExpenses
      },
      createArrofMonthIncomes() {
        let CurrMonthIncomes = []
        for (let m = 0; m < 12; m++) {
          CurrMonthIncomes.push(this.incomes.filter(income =>
            moment(income.date, "DD.MM.YYYY").isSame(moment().month(m), 'month'))
          )
        }
        return CurrMonthIncomes
      },
      getTotalMounthesExpense() {
        let TotalMounthesExpense = []
        for (let m = 0; m < 12; m++) {
          let totalSum = 0;
          this.createArrofMonthExpenses()[m].forEach(i => totalSum += +i.sum)
          if (totalSum !== 0) {
            TotalMounthesExpense.push(totalSum)
          }
        }
        return TotalMounthesExpense
      },
      getCurrentIncomes(month) {
        let totalSum = 0;
        let currentIncomes = this.incomes.filter(income =>
          moment(income.date, "DD.MM.YYYY").isSame(moment(month, "MM.YYYY"), 'month'));
        if (currentIncomes.count !== 0) {
          currentIncomes.forEach(e => totalSum += +e.sum);
        }
        return {Array: currentIncomes, Sum: totalSum};
      },
      getCurrentExpenses(month) {
        let totalSum = 0;
        let currentExpenses = this.expenses.filter(expense =>
          moment(expense.date, "DD.MM.YYYY").isSame(moment(month, "MM.YYYY"), 'month'));
        if (currentExpenses.count !== 0) {
          currentExpenses.forEach(e => totalSum += +e.sum);
        }
        return {Array: currentExpenses, Sum: totalSum};
      },
      getTotalMounthesIncomes() {
        let TotalMounthesIncomes = []
        for (let m = 0; m < 12; m++) {
          let totalSum = 0;
          let month = moment().month(0).add(m, 'M').format("MM.YYYY")
          this.createArrofMonthIncomes()[m].forEach(i => totalSum += +i.sum)
          if (totalSum !== 0) {
            TotalMounthesIncomes.push({
              id: m,
              value: totalSum,
              month: month,
              totalIncomes: this.getCurrentIncomes(month).Sum,
              totalExpenses: this.getCurrentExpenses(month).Sum,
              saldo: this.getSaldo(month),
              isHidden: true,
              currentIncomes: this.getCurrentIncomes(month).Array,
              currentExpenses: this.getCurrentExpenses(month).Array,
            });
          }
        }
        return TotalMounthesIncomes
      },
      getSaldo(month) {
        return this.getCurrentIncomes(month).Sum - this.getCurrentExpenses(month).Sum;
      },
      getTotalSaldo () {
        let TotalSaldo = 0
        for(let m = 0; m < 12; m++){
          let month = moment().month(m)
          TotalSaldo += this.getSaldo(month)
        }
        return TotalSaldo
      },
      onShowInformation(totalSum) {
        if(totalSum.isHidden)
        {
          totalSum.isHidden = false;
        } else {
          totalSum.isHidden = true;
        }
      },
    }
  }
  </script>
  <style scoped lang="css">
    table {
      position: relative;
      margin: 40px auto 0;
      text-align: left;
      border-collapse: separate;
      border-spacing: 5px;
      background: #ECE9E0;
      color: #656665;
      border: 16px solid #ECE9E0;
      border-radius: 20px;

    }
    .details {
      position: relative;
      vertical-align: top;
      margin: 0;
      text-align: left;
      border-collapse: separate;
      border-spacing: 0;
      background: #ECE9E0;
      border: 1px solid #ECE9E0;
      border-radius: 0;
    }
    th {
      text-align: center;
      font-size: 18px;
      padding: 10px;
    }
    .details th {
      text-align: center;
      font-size: 14px;
      padding: 5px;
    }
    td {
      font-weight: bold;
      text-align: center;
      width: 300px;
      background:  #707981;
      color: white;
      padding: 10px;
    }
    .details td {
      font-weight: bold;
      text-align: center;
      width: 300px;
      height: auto;
      background:  #707981;
      color: white;
      padding: 5px;
    }
    h4 {
      margin-top: 50px;
      text-align: center
    }
    [data-tooltip]::after {
      content: attr(data-tooltip);
      position: absolute;
      width: 300px;
      left: 200px; top: 0;
      background: #ECE9E0;
      color: black;
      padding: 0.5em;
      box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
      pointer-events: none;
      opacity: 0;
      transition: 0s;
    }
    [data-tooltip]:hover::after {
      opacity: 1;
      top: auto;
    }


</style>
