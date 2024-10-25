"use strict";

class User {
  constructor(username, isAdmin, isTemporary, connectedToGroup, id) {
    this.username = username;
    this.isAdmin = isAdmin;
    this.isTemporary = isTemporary;
    this.connectedToGroup = connectedToGroup;
    this.id = id;
  }
}
