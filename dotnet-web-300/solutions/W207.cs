// W207: Endpoint route metadata / scenario 7
// GET /catalog7/{id:int}; name catalog-7
// Read prompts/W207.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W207 {

 public static RouteEndpoint Build() {
  var builder=new RouteEndpointBuilder(_=>Task.CompletedTask,RoutePatternFactory.Parse("/catalog7/{id:int}"),0){DisplayName="catalog-7"};builder.Metadata.Add(new HttpMethodMetadata(new[]{"GET"}));builder.Metadata.Add(new EndpointNameMetadata("catalog-7"));return (RouteEndpoint)builder.Build();
 }
}
