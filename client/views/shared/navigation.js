Template.navigation.helpers({
  activeIfRouteNameIs: (routeName) => {
    if (FlowRouter.getRouteName() === routeName) {
      return 'active';
    }
    return '';
  }
});
