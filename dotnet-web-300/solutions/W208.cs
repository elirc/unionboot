// W208: Endpoint route metadata / scenario 8
// GET /catalog8/{id:int}; name catalog-8
// Read prompts/W208.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W208 {

 public static RouteEndpoint Build() {
  var builder=new RouteEndpointBuilder(_=>Task.CompletedTask,RoutePatternFactory.Parse("/catalog8/{id:int}"),0){DisplayName="catalog-8"};builder.Metadata.Add(new HttpMethodMetadata(new[]{"GET"}));builder.Metadata.Add(new EndpointNameMetadata("catalog-8"));return (RouteEndpoint)builder.Build();
 }
}
