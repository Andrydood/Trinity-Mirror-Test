/**
 * @Author: andreacasino
 * @Date:   2017-09-15T19:56:09+01:00
 * @Last modified by:   andreacasino
 * @Last modified time: 2017-09-17T20:12:11+01:00
 */

import {Grid, Row, Col} from 'react-bootstrap';
import React,{ Component } from 'react';
import PalindromeList from './PalindromeList';
import './App.css';
import './libraries/font-awesome/css/font-awesome.min.css';


class App extends Component{

    constructor(props){
        super(props);
        this.state={
            //List of palindromes
            palindromes: null,
            inputString:'',
            searchBarState:'',
            latestStringEval:null,
            page:0
        }
    }

    //Fetches palindromes
    getPalindromeList() {
      const FETCH_URL = "http://127.0.0.1:8000/palindrome/"
                        +this.state.page;
      fetch(FETCH_URL,{
        method:'GET'
      }).then(
        response => response.json())
        .then(
          json => {
            const palindromes = json;
            this.setState({palindromes});
          }).catch(function(error) {
              alert("System was not able to connect to server");
            })}

    //Posts text to be evaluated as palindrome
    postPalindrome(){
      const FETCH_URL = "http://127.0.0.1:8000/palindrome/";
      fetch(FETCH_URL,{
        method:'POST',
        body:JSON.stringify({text:this.state.inputString})
      }).then(
        response => response.json())
        .then(
          json => {
            const APIResponse = json;
            this.setState({latestStringEval:APIResponse})
            if(APIResponse === true){
              this.getPalindromeList();
            }}).catch(function(error) {
                alert("System was not able to connect to server");
              })}

    //Sends delete request
    deletePalindromes(){
      const FETCH_URL = "http://127.0.0.1:8000/palindrome/";
      fetch(FETCH_URL,{
        method:'DELETE'
      }).then(
        this.setState({page:0}),
        this.getPalindromeList()
        ).catch(function(error) {
            alert("System was not able to connect to server");
          })}

    //Reads text written in search bar. Only allows non empty strings
    readSearchBar(event){
      if(this.state.searchBarState!==""){
          this.setState({inputString:this.state.searchBarState},
            function(){
              this.postPalindrome()
              this.setState({inputString:""})
              this.setState({searchBarState:""})
            });
          document.getElementById("searchField").value="";
        }
        event.preventDefault();
      }

    //Returns the state of the previously evaluated string
    stringEval(){
      if(this.state.latestStringEval != null){
        if(this.state.latestStringEval === true){
          return(<div
                      id="stringEval"
                      className="positive">
                      The last input was a palindrome <i className="fa fa-check" aria-hidden="true"></i>
                  </div>)
        }else{
        return(<div
                    id="stringEval"
                    className="negative">
                    The last input was not a palindrome <i className="fa fa-times" aria-hidden="true"></i>
                </div>)
      }}
      return(<div id="stringEval"></div>)
    }


    pageForward(){
      const newPage = this.state.page + 1;
      this.setState({page:newPage},function(){
        this.setState({palindromes:null},function(){
          this.getPalindromeList()});
        });
    }

    pageBack(){
      const newPage = this.state.page - 1;
      if(newPage>=0){
        this.setState({page:newPage},function(){
          this.setState({palindromes:null},function(){
            this.getPalindromeList()});
          });
      }
    }


    /*Only show back arrow if on page 1+,
    only show front arrow if there is pages left*/
    backButtonLayout(){
      if(this.state.page>0){
        return(
            <Col xs={1} xsOffset={4} id="backButton">
              <i
                className="fa fa-arrow-circle-o-left fa-2x"
                aria-hidden="true"
                onClick={()=>this.pageBack()}></i>
            </Col>
        )
      }
      else{
        return(
          <Col xs={1} xsOffset={4}></Col>
        )
      }
    }

    forwardButtonLayout(){
      if(this.state.palindromes){
        if(this.state.palindromes.length<10){
          return(
              <Col xs={1} xsOffset={0}></Col>
          )
        }
        else{
          return(
              <Col xs={1} xsOffset={0} id="forwardButton">
                <i className="fa fa-arrow-circle-o-right fa-2x"
                  aria-hidden="true"
                  onClick={()=>this.pageForward()}></i>
              </Col>
          )}}
    }

    //Fetch when page loads
    componentWillMount() {
      this.getPalindromeList()
    }

    render(){
        return(
          <div id="app">
            <Grid id = "header">
              <Row id = "formContainer">
                <Col
                    xs={12}
                    md={8}
                    mdOffset={2}
                    id="title">
                  Palindrome Tester
                </Col>
                <Col
                    xs={12}
                    md={8}
                    mdOffset={2}>
                  <div id="form">
                    <form
                          id="searchForm"
                          onSubmit={event => this.readSearchBar(event)}
                          autoComplete="off">
                      <input
                            type="text"
                            placeholder={"Test your palindrome!"}
                            onChange = {event => this.setState({searchBarState:event.target.value})}
                            id="searchField"/>
                          <i
                            className="fa fa-upload"
                            aria-hidden="true"
                            id="searchButton"
                            onClick={event=>this.readSearchBar(event)}></i>
                    </form>
                  </div>
                </Col>
              </Row>
              <Col
                  xs={12}
                  md={8}
                  mdOffset={2}>
                <div>
                  {this.stringEval()}
                </div>
              </Col>
            </Grid>
            <PalindromeList
              palindromes={this.state.palindromes}>
            </PalindromeList>
            <div
              id="buttonContainer">
              <Grid
                id="pageButtons">
                {this.backButtonLayout()}
                <Col xs={2} xsOffset={0} id="pageNum">
                  {this.state.page}
                </Col>
                {this.forwardButtonLayout()}
              </Grid>
            </div>
            <div
                id="deleteButtonContainer"
                onClick={()=>this.deletePalindromes()}>
              <div id="deleteButton"
                   className="unselectable">
                   Delete all palindromes <i className="fa fa-trash" aria-hidden="true"></i>
              </div>
            </div>
          </div>
        )
    }
}

export default App;
