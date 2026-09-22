// W205: Endpoint route metadata / scenario 5
// GET /catalog5/{id:int}; name catalog-5
// Read prompts/W205.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W205 {

 public static RouteEndpoint Build() {
  var builder=new RouteEndpointBuilder(_=>Task.CompletedTask,RoutePatternFactory.Parse("/catalog5/{id:int}"),0){DisplayName="catalog-5"};builder.Metadata.Add(new HttpMethodMetadata(new[]{"GET"}));builder.Metadata.Add(new EndpointNameMetadata("catalog-5"));return (RouteEndpoint)builder.Build();
 }
}
