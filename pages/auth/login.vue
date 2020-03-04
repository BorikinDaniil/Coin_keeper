<template>
  <validation-observer ref="loginForm" v-slot="{ handleSubmit }" class="container h-100vh" tag="div">
    <form class="transparent" @submit.prevent="handleSubmit(onSubmit)">
      <div class="form-inner" >
        <h3>Вход на сайт</h3>
        <validation-provider v-slot="{ errors, classes }" name="Email адрес" rules="required|email" tag="div" class="form-group">
          <label for="email">Email адрес</label>
          <input
            id="email"
            v-model="user.email"
            :class="classes"
            name="email"
            type="text"
            class="form-control"
          >
          <div class="invalid-feedback">
            <strong>{{ errors[0] }}</strong>
          </div>
        </validation-provider>
        <validation-provider v-slot="{ errors, classes }" name="Пароль" rules="required|min:5" tag="div" class="form-group">
          <label for="password">Пароль</label>
          <input
            id="password"
            v-model="user.password"
            :class="classes"
            name="password"
            type="password"
            class="form-control"
          >
          <div class="invalid-feedback">
            <strong>{{ errors[0] }}</strong>
          </div>
        </validation-provider>
        <input type="submit" value="Войти">
      </div>
    </form>
  </validation-observer>
</template>

<script>
  export default {
    layout: 'withOutDate',
    name: "login",
    data: () => ({
      user: {
        email: '',
        password:''
      }
    }),
    methods: {
      async onSubmit () {
        if (await this.$refs.loginForm.validate()) {
          await this.$auth.loginWith('local', {
            data: this.user
          })
          await this.$router.push({ name: 'home' })
        }
      }
    }
  }
</script>

<style scoped lang="css">
  * {box-sizing: border-box;}
  .transparent {
    position: relative;
    max-width: 400px;
    padding: 60px 50px;
    margin: 50px auto 0;
    background-size: cover;
  }
  .transparent:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to right bottom,rgba(43, 44, 78, .5),rgba(104, 22, 96, .5));
  }
  .form-inner {position: relative;}
  .form-inner h3 {
    position: relative;
    margin-top: 0;
    color: white;
    font-family: 'Roboto', sans-serif;
    font-weight: 300;
    font-size: 26px;
    text-transform: uppercase;
  }
  .form-inner h3:after {
    content: "";
    position :absolute;
    left: 0;
    bottom: -6px;
    height: 2px;
    width: 60px;
    background: #1762EE;
  }
  .form-inner label {
    display: block;
    padding-left: 15px;
    font-family: 'Roboto', sans-serif;
    color: white;
    font-size: 14px;
  }
  .form-inner input {
    display: block;
    width: 100%;
    padding: 0 15px;
    margin: 10px 0 15px;
    border-width: 0;
    line-height: 40px;
    border-radius: 20px;
    color: white;
    background: rgba(255,255,255,.2);
    font-family: 'Roboto', sans-serif;
  }
  .form-inner input[type="checkbox"] {
    position: absolute;
    opacity: 0;
  }
  #custom-checkbox + label {
    position: relative;
    margin: 20px 0;
    text-transform:none;
    cursor: pointer;
  }
  #custom-checkbox + label:before {
    content: "";
    display: inline-block;
    width: 20px;
    height: 20px;
    margin-right: 10px;
    vertical-align: text-top;
    background: white;
  }
  #custom-checkbox:checked + label:before {background: #1762EE;}
  #custom-checkbox:checked + label:after {
    content: "";
    position: absolute;
    width: 2px;
    height: 2px;
    left: 20px;
    top: 9px;
    background: white;
    box-shadow: 2px 0 0 white, 4px 0 0 white, 4px -2px 0 white, 4px -4px 0 white, 4px -6px 0 white, 4px -8px 0 white;
    transform: rotate(45deg);
  }
  .form-inner input[type="submit"] {background: #1762EE;}
</style>
