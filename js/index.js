class Main extends React.Component{
  constructor(props){
    super(props)
    //check if any storage on local machine for initial render
    if(localStorage.getItem('fullState')){
      this.state=JSON.parse(localStorage.getItem('fullState'))
    }
    else{
      //initial recipe render incase nothing stored on local machine
      this.state=
          {
            "Steak Burrito":["fresh salsa","brown rice","strip steak","black beans"],
            "Kitfo":["freshly cut ground beef","cayenne pepper (Mitmita*)","clarified butter (Nitir Kebe)"],
            "Cheeseburger":["freshly ground chuck","American cheese","large	burger buns"]
          }
    }
    //binding functions that use'this'
    this.editRecipeCallBack=this.editRecipeCallBack.bind(this)
    this.addRecipeCallBack=this.addRecipeCallBack.bind(this)
    this.storeLocal=this.storeLocal.bind(this)
  }
  //call back for new recipe addition
  addRecipeCallBack(newInfo){
    //ne info is ingredients added edited
    var x=newInfo.newIngridients.split(',')
    //filter out falsy values of edition
    x=x.filter(function(i){
      if(i){return i;}
    })
    //set state and callback to store in local storage
    this.setState({[newInfo.recipeName]: x},this.storeLocal)
  }
  editRecipeCallBack(change){
   if(change){
     //means edition
     var x=change.newIngridients.split(',')
     x=x.filter(function(i){
       if(i){return i;}
     })
     //set state and callback to store in local storage
     this.setState({ [change.recipeName]: x},this.storeLocal)
   }
   else{
     //means edition , just force update as main state object is mutated from
     //calling function, note parameter is callback
     this.forceUpdate(this.storeLocal);
   }
 }
 //callback for local storage after set state
  storeLocal(){
    localStorage.setItem('fullState', JSON.stringify(this.state));
  }

  render(){
    return(
      <div>
        <h1 id="boxtitle">Recipe Box</h1>
        <div id="holder">
          {/*calls Recipe class and ready for button from recipe callback which is only used for deleteing recipe*/}
          <Recipe current={this.state} callBackToMain={this.editRecipeCallBack} ></Recipe>
        </div>
        <div id="buttonHolder">
          {/*calls UserModal class and ready for button from UserModal callback which is used for editing/adding to recipe
            Note arrow function necessary or will not bind!!*/}
          <UserModal editInfo={["Add Recipe",""]} callBackToMain={(newIngridients)=>this.addRecipeCallBack(newIngridients)}></UserModal>
        </div>
      </div>
    )
  }
}
class Recipe extends React.Component{
  constructor(props){
    super(props)
    this.deleteRecipe=this.deleteRecipe.bind(this)
  }
  deleteRecipe(r){
    //called from within this class to delete the recipe
    delete this.props.current[r]
    //go back to parent to reset state
    this.props.callBackToMain();
  }
  editRecipe(newIngridients){
    //called from modal and chained back to parent to reset state
    this.props.callBackToMain(newIngridients);
  }
  hashRecipe(currentState){
    //cretaes list of recipes with Ingredients
    //all reactBootstrap components must be declared
    var Accordion = ReactBootstrap.Accordion ;
    var Panel = ReactBootstrap.Panel ;
    var Button = ReactBootstrap.Button;
    //current state comes as a property of this class use to instantiate recipes
    var recipes = Object.keys(currentState).slice();
    //note must use arrow function or r will not be bound inside the loop
    var x=recipes.map(r=>{
      return(
        //Components to be returned for each recipe
        <Accordion>
        {/*React bootstrap accordiion*/}
          <Panel header={r} eventKey={r}>
          {/*React bootstrap panel*/}
            {/*Call ingredients listing class*/}
            <Ingredients ingrid={currentState[r]}/>
            {/*Delete bootstrap button with callbacl, must use arrow function to bind*/}
            <Button key={"Delete" + r} onClick={()=>this.deleteRecipe(r)} className="btn btn-danger">Delete</Button>
            <div className="updateButton">
              {/*modal class caller with callback to this class with returning parameter of edits*/}
              <UserModal editInfo={[r,currentState[r]]} callBackToRecipe={(newIngridients)=>this.editRecipe(newIngridients)}></UserModal>
            </div>
          </Panel>
        </Accordion>
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
  //parses ingredients in to a list
  listParser(ings){
    var z=ings.map(i=>{
      return(
        <li className="list-group-item">{i}</li>
      )
    })
    return z;
  }

  render(){
    return(
          <ul className="list-group">
            {this.listParser(this.props.ingrid)}
          </ul>
    )

  }

}
class UserModal extends React.Component{
  //Modal interaction and caller
  constructor(props){
    super(props)
    //initialize modal state and assign params on open
    this.state={
      show:false,
      recipeName:'',
      oldIngridients:'',
      newIngridients:''
    }
    //bind all necessary functions that use 'this'
    this.open=this.open.bind(this)
    this.close=this.close.bind(this)
    this.update=this.update.bind(this)
    this.handleChange=this.handleChange.bind(this)
    this.formRenderType=this.formRenderType.bind(this)
  }
  open(){
    //when modal is opened note edit info coming from the props of this class as an array
    //of the ingredients and recipe name for active recipe
    this.setState({
      show:true,
      recipeName:this.props.editInfo[0],
      oldIngridients:this.props.editInfo[1]
    })
  }
  close(){
    //when modal is closed reset back to original state
    this.setState({
      show: false,
      recipeName:'',
      oldIngridients:'',
      newIngridients:''
    });
  }

  update(){
    //first check if call is for edit or addition of recipe
    if(this.props.editInfo[0]!=="Add Recipe"){//for edit
      if(this.state.newIngridients!==''){//check that ingredients has changed
        //callBackToRecipe which will chain back to main
        this.props.callBackToRecipe(this.state);
      }
    }
    else{//for addition
      if(this.state.recipeName!=='Add Recipe'){//check that recipe field is not empty
        //callBackToMain stright back up to main module
        this.props.callBackToMain(this.state);
      }
    }
    //close modal
    this.close();
  }
  handleChange(e){
    //handles user form interaction
    e.preventDefault()
    if(this.props.editInfo[0]!=="Add Recipe"){//for edits
      this.setState({ newIngridients: e.target.value});
    }
    else{//for recipe addition
      if(e.target.id==="addRecipeText"){//for recipe field
        this.setState({ recipeName: e.target.value});
      }
      else{//for ingredient field
        this.setState({ newIngridients: e.target.value});
      }
    }
  }
  formRenderType(){
    //function returns different type of form render depending on addition of recipe
    //or editing recipe
    //all reactBootstrap components must be declared
    var FormGroup = ReactBootstrap.FormGroup;
    var FormControl = ReactBootstrap.FormControl;
    var ControlLabel = ReactBootstrap.ControlLabel ;
    //for edit of recipe
    if(this.props.editInfo[0]!=="Add Recipe"){
      //use only one input line
      var formType= (
              <FormGroup controlId="formBasicText">
                <ControlLabel>Ingredients</ControlLabel>
                <FormControl
                  type="text"
                  defaultValue={this.state.oldIngridients}
                  onChange={this.handleChange}
                />
                <FormControl.Feedback />
            </FormGroup>
          )
    }
    else{//for addition of recipe
      //use form with two input lines and give different ID's to identify which input
      //text is coming from
      var formType= (
              <div>
                <FormGroup controlId="addRecipeText">
                  <ControlLabel>New Recipe</ControlLabel>
                  <FormControl
                    type="text"
                    defaultValue={this.state.oldIngridients}
                    onChange={this.handleChange}
                  />
                  <FormControl.Feedback />
                </FormGroup>
                <FormGroup controlId="addIngridText">
                  <ControlLabel>Ingredients</ControlLabel>
                  <FormControl
                    type="text"
                    defaultValue={this.state.oldIngridients}
                    onChange={this.handleChange}
                  />
                  <FormControl.Feedback />
                </FormGroup>
              </div>
          )
    }
    return formType;
  }

  render(){
    //all reactBootstrap components must be declared
    var Modal = ReactBootstrap.Modal;
    var Button = ReactBootstrap.Button;
    //set variables for edit or addition that are to be included in modal
    if(this.props.editInfo[0]!=="Add Recipe"){
      var modalTitle= "Edit Ingredients For " + this.state.recipeName;
      var buttonTitle = "Update Recipe";
      var buttonType = "info";
      var openerButtonType = "info";
      var openerButtonSize = "";
    }
    else{
      var modalTitle= "Add A New Recipe ";
      var buttonTitle = "Add Recipe";
      var buttonType = "primary";
      var openerButtonType = "warning";
      var openerButtonSize = "large";
    }
    return(
      <div>
      <Button bsStyle={openerButtonType} bsSize={openerButtonSize} onClick={() => this.open()}>{buttonTitle}</Button>
      <div className="modal-container">
        <Modal
          show={this.state.show}
          onHide={this.close}
          container={this}
          aria-labelledby="contained-modal-title"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title">{modalTitle}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.formRenderType()}
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.update} bsStyle={buttonType}>{buttonTitle}</Button><Button onClick={this.close}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
      </div>
    )
  }
}
ReactDOM.render(
  <Main />,
  document.getElementById("app")
)
