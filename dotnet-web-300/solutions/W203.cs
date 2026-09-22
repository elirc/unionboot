// W203: Endpoint route metadata / scenario 3
// GET /catalog3/{id:int}; name catalog-3
// Read prompts/W203.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W203 {

 public static RouteEndpoint Build() {
  var builder=new RouteEndpointBuilder(_=>Task.CompletedTask,RoutePatternFactory.Parse("/catalog3/{id:int}"),0){DisplayName="catalog-3"};builder.Metadata.Add(new HttpMethodMetadata(new[]{"GET"}));builder.Metadata.Add(new EndpointNameMetadata("catalog-3"));return (RouteEndpoint)builder.Build();
 }
}
