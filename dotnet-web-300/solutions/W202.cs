// W202: Endpoint route metadata / scenario 2
// GET /catalog2/{id:int}; name catalog-2
// Read prompts/W202.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W202 {

 public static RouteEndpoint Build() {
  var builder=new RouteEndpointBuilder(_=>Task.CompletedTask,RoutePatternFactory.Parse("/catalog2/{id:int}"),0){DisplayName="catalog-2"};builder.Metadata.Add(new HttpMethodMetadata(new[]{"GET"}));builder.Metadata.Add(new EndpointNameMetadata("catalog-2"));return (RouteEndpoint)builder.Build();
 }
}
