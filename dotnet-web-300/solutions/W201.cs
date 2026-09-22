// W201: Endpoint route metadata / scenario 1
// GET /catalog1/{id:int}; name catalog-1
// Read prompts/W201.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W201 {

 public static RouteEndpoint Build() {
  var builder=new RouteEndpointBuilder(_=>Task.CompletedTask,RoutePatternFactory.Parse("/catalog1/{id:int}"),0){DisplayName="catalog-1"};builder.Metadata.Add(new HttpMethodMetadata(new[]{"GET"}));builder.Metadata.Add(new EndpointNameMetadata("catalog-1"));return (RouteEndpoint)builder.Build();
 }
}
