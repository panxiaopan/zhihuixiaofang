export default{
  data(){
    return{
      isMounted: false
    }
  },
  mounted(){
    console.log(this.$options.name + ' mounted')
    this.isMounted = true;
  }
}