class Main extends React.Component{
  constructor(props){
    super(props)
    this.state=
      {
        "Pumpkin Pie":["Pumpkin Puree","Sweetened Condensed Milk","Eggs","Pumpkin Pie Spice","Pie Crust"],
        "Spaghetti":["Noodles","Tomato Sauce","(Optional) Meatballs"],
        "Onion Pie":["Onion","Pie Crust","Sounds Yummy right?"]
      }
  }
 
  render(){
    return(
      <div>
        <Recipe current={this.state}/>
      </div>
    )
  }
}

class Recipe extends React.Component{
  buttontest(){
    alert("yes I got clicked")
  }

  hashRecipe(currentState){
    var recipes = Object.keys(currentState).slice();
    var x = [];
    for(var i=0;i<recipes.length;i++){
      x.push(
        <article>
          <h1>{recipes[i]}</h1>
          <Ingredients ingrid={currentState[recipes[i]]}/>
          <button onClick={this.buttontest}/>
        </article>
      )
    }
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
