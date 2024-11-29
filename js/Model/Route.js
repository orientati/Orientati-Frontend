"use strict";

class Route {
    constructor(
        icon = "",
        isAdmin = false,
        routeName = "Unnamed Route",
        href = "#"
    ) {
        this.icon = icon;
        this.isAdmin = isAdmin;
        this.routeName = routeName;
        this.href = href;
    }
}
