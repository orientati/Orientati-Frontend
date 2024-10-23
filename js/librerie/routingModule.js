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

const routes = [];

// ICON da modificare
try {
  routes.push(new Route("", false, "Home", "https://example.com/home"));
  routes.push(new Route("", true, "Admin", "https://example.com/admin"));
} catch (error) {
  console.error(error.message);
}

function createComponents(htmlElementToAppend, admin = false) {
  const htmlElement = document.querySelector(htmlElementToAppend);

  for (const route of routes) {
    const p = document.createElement("p");

    if (admin) {
      p.innerHTML = `icon: ${route.icon} - isAdmin: ${route.isAdmin} - routeName: ${route.routeName} - href: ${route.href} `;
    } else {
      p.innerHTML = `icon: ${route.icon} - routeName: ${route.routeName} - href: ${route.href} `;
    }

    htmlElement.appendChild(p);
  }
}
