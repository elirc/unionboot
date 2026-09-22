// W206: Endpoint route metadata / scenario 6
// GET /catalog6/{id:int}; name catalog-6
// Read prompts/W206.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W206 {

 public static RouteEndpoint Build() {
  var builder=new RouteEndpointBuilder(_=>Task.CompletedTask,RoutePatternFactory.Parse("/catalog6/{id:int}"),0){DisplayName="catalog-6"};builder.Metadata.Add(new HttpMethodMetadata(new[]{"GET"}));builder.Metadata.Add(new EndpointNameMetadata("catalog-6"));return (RouteEndpoint)builder.Build();
 }
}
