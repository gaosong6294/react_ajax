import React, {Component, PropTypes} from 'react';
import axios from 'axios';

export default class Main extends Component {

  static propTypes = {
    searchName: PropTypes.string.isRequired
  };

  state = {
    startValue: true,
    loading: false,
    users: null,
    errorMsg: null
  };

  componentWillReceiveProps(nextProps){
    const searchName = nextProps.searchName;
    this.setState({
      startValue: false,
      loading: true
    });
    const url = `https://api.github.com/search/users?q=${searchName}`;
    axios.get(url)
      .then(response => {
        const result = response.data;
        const users = result.items.map(item => {
          return {
            user_url: item.html_url,
            avatar_url: item.avatar_url,
            username: item.login
          }
        });
        this.setState({
          loading: false,
          users
        });
      })
      .catch(error => {
        this.setState({
          loading: false,
          errorMsg: '完犊子了~!'
        })
      })
  };

  render(){
    const {startValue, loading, users, errorMsg} = this.state;
    if(startValue){
      return <h2>请输入用户名: {this.props.searchName}</h2>
    }else if(loading){
      return <h2>搜索中...</h2>
    }else if(errorMsg){
      return <h2>{errorMsg}</h2>
    }else{
      return(
        <div className="row">
          {
            users.map((user, index) => (
              <div className="card" key={index}>
                <a href={user.user_url} target="_blank">
                  <img src={user.avatar_url} style={{width: '100px'}}/>
                </a>
                <p className="card-text">{user.username}</p>
              </div>
            ))
          }
        </div>
      )
    }
  }
}