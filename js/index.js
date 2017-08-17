class Main extends React.Component{
  constructor(props){
    super(props)
    if(localStorage.getItem('fullState')){
      console.log(localStorage.getItem('fullState'))
      this.state=JSON.parse(localStorage.getItem('fullState'))
    }
    else{

      this.state=
          {
            "Pumpkin Pie":["Pumpkin Puree","Sweetened Condensed Milk","Eggs","Pumpkin Pie Spice","Pie Crust"],
            "Spaghetti":["Noodles","Tomato Sauce","(Optional) Meatballs"],
            "Onion Pie":["Onion","Pie Crust","Sounds Yummy right?"]
          }
    }

    this.myCallBack=this.myCallBack.bind(this)
    this.addRecipe=this.addRecipe.bind(this)
    this.storeLocal=this.storeLocal.bind(this)
  }

  addRecipe(newInfo){
    var x=newInfo.newIngridients.split(',')
    x=x.filter(function(i){
      if(i){return i;}
    })
    this.setState({[newInfo.recipeName]: x},this.storeLocal)
  }

 myCallBack(change){
   if(change){
     var x=change.newIngridients.split(',')
     x=x.filter(function(i){
       if(i){return i;}
     })
     this.setState({ [change.recipeName]: x},this.storeLocal)

   }
   else{
     this.forceUpdate(this.storeLocal);
   }
 }

  storeLocal(){
    localStorage.setItem('fullState', JSON.stringify(this.state));
  }

    render(){
      return(
        <div>
          <h1 id="boxtitle">Recipe Box</h1>
          <div id="holder">
            <Recipe current={this.state} callBackFromMain={this.myCallBack} ></Recipe>
          </div>
          <div id="buttonHolder">
            <UserModal editInfo={["Add Recipe",""]} callBackFromMain={(newIngridients)=>this.addRecipe(newIngridients)}>Edit</UserModal>
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

    delete this.props.current[r]
    this.props.callBackFromMain();
    //this.props.callBackFromMain=this.props.current
  }

  editRecipe(newIngridients){
    this.props.callBackFromMain(newIngridients);
  }

  hashRecipe(currentState){
    var Accordion = ReactBootstrap.Accordion ;
    var Panel = ReactBootstrap.Panel ;
    var Button = ReactBootstrap.Button;
    var recipes = Object.keys(currentState).slice();
    var x=recipes.map(r=>{
      return(
        <Accordion>
          <Panel header={r} eventKey={r}>
            <Ingredients ingrid={currentState[r]}/>
            <Button key={"Delete" + r} onClick={()=>this.deleteRecipe(r)} className="btn btn-danger">Delete</Button>
            <div className="updateButton">
              <UserModal editInfo={[r,currentState[r]]} callBackFromRecipe={(newIngridients)=>this.editRecipe(newIngridients)}>Edit</UserModal>
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
  listParser(ings){
    var z=[]
    for(var i=0;i<ings.length;i++){
      z.push(
        <li className="list-group-item">{ings[i]}</li>
      )
    }
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
  constructor(props){
    super(props)
    this.state={
      show:false,
      recipeName:'',
      oldIngridients:'',
      newIngridients:''
    }
    this.open=this.open.bind(this)
    this.close=this.close.bind(this)
    this.update=this.update.bind(this)
    this.handleChange=this.handleChange.bind(this)
    this.formRenderType=this.formRenderType.bind(this)
  }
  open(){
    this.setState({
      show:true,
      recipeName:this.props.editInfo[0],
      oldIngridients:this.props.editInfo[1]
    })
  }
  close(){
    this.setState({
      show: false,
      recipeName:'',
      oldIngridients:'',
      newIngridients:''
    });
  }
  update(){
    if(this.props.editInfo[0]!=="Add Recipe"){
      this.props.callBackFromRecipe(this.state);
    }
    else{
      this.props.callBackFromMain(this.state);
    }
    //console.log(this)
    this.close();
  }
  handleChange(e){
    e.preventDefault()
    if(this.props.editInfo[0]!=="Add Recipe"){
      this.setState({ newIngridients: e.target.value});
    }
    else{
      if(e.target.id==="addRecipeText"){
        this.setState({ recipeName: e.target.value});
      }
      else{
        this.setState({ newIngridients: e.target.value});
      }
    }
  }
  formRenderType(){
    var FormGroup = ReactBootstrap.FormGroup;
    var FormControl = ReactBootstrap.FormControl;
    var ControlLabel = ReactBootstrap.ControlLabel ;
    if(this.props.editInfo[0]!=="Add Recipe"){
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
    else{
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
    var Modal = ReactBootstrap.Modal;
    var Button = ReactBootstrap.Button;
    if(this.props.editInfo[0]!=="Add Recipe"){
      var modalTitle= "Editing Ingredients For " + this.state.recipeName;
      var buttonTitle = "Update Recipe";
      var buttonType = "info";
      var openerButtonType = "info";
      var openerButtonSize = "";
    }
    else{
      var modalTitle= "Add A New Recipe ";
      var buttonTitle = "Add Recipe";
      var buttonType = "btn btn-primary";
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
