// W204: Endpoint route metadata / scenario 4
// GET /catalog4/{id:int}; name catalog-4
// Read prompts/W204.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W204 {

 public static RouteEndpoint Build() {
  var builder=new RouteEndpointBuilder(_=>Task.CompletedTask,RoutePatternFactory.Parse("/catalog4/{id:int}"),0){DisplayName="catalog-4"};builder.Metadata.Add(new HttpMethodMetadata(new[]{"GET"}));builder.Metadata.Add(new EndpointNameMetadata("catalog-4"));return (RouteEndpoint)builder.Build();
 }
}
