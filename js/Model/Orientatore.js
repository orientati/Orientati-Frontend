"use strict";

class Orientatore {
    constructor(
        name = "",
        surname = "",
        email = "",
        schoolSection = "",
        schoolAddressId = 0,
        schoolAddressName = "",
        groupsIn = [],
        id = 0
    ){
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.schoolSection = schoolSection;
        this.schoolAddressId = schoolAddressId;
        this.schoolAddressName = schoolAddressName;
        this.groupsIn = groupsIn;
        this.id = id;
    }
}