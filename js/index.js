class Main extends React.Component{
  constructor(props){
    super(props)
    this.state={
      "full":
        {
          "Pumpkin Pie":["Pumpkin Puree","Sweetened Condensed Milk","Eggs","Pumpkin Pie Spice","Pie Crust"],
          "Spaghetti":["Noodles","Tomato Sauce","(Optional) Meatballs"],
          "Onion Pie":["Onion","Pie Crust","Sounds Yummy right?"]
        }

    }

      this.myCallBack=this.myCallBack.bind(this)
  }

 myCallBack(){
   this.forceUpdate();
   //this.setState({ "full": param });
 }
  render(){
    return(
      <div>
        <Recipe current={this.state.full} callBackFromMain={this.myCallBack} ></Recipe>
      </div>
    )
  }
}

class Recipe extends React.Component{
  constructor(props){
    super(props)
    this.buttontest=this.buttontest.bind(this)
  }
  buttontest(r){
    console.log(r)
    this.props.current[r].pop()
    this.props.callBackFromMain();
    //this.props.callBackFromMain=this.props.current
  }

  hashRecipe(currentState){
    var recipes = Object.keys(currentState).slice();
    var x=recipes.map(r=>{
      return(
        <article>
          <h1>{r}</h1>
          <Ingredients ingrid={currentState[r]}/>
          <button key={r} onClick={()=>this.buttontest(r)} className="btn" ></button>
        </article>
      )
    })
    return x;
  }
  render(){
    return(
      <div>
        {this.hashRecipe(this.props.current)}
      </div>
    )
  }
}


class Ingredients extends React.Component{
  listParser(ings){
    var z=[]
    for(var i=0;i<ings.length;i++){
      z.push(
        <li>{ings[i]}</li>
      )
    }
    return z;
  }

  render(){
    return(
          <ul>
            {this.listParser(this.props.ingrid)}
          </ul>
    )

  }

}


ReactDOM.render(
  <Main />,
  document.getElementById("app")
)
