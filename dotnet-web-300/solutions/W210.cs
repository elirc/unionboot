// W210: Endpoint route metadata / scenario 10
// GET /catalog10/{id:int}; name catalog-10
// Read prompts/W210.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W210 {

 public static RouteEndpoint Build() {
  var builder=new RouteEndpointBuilder(_=>Task.CompletedTask,RoutePatternFactory.Parse("/catalog10/{id:int}"),0){DisplayName="catalog-10"};builder.Metadata.Add(new HttpMethodMetadata(new[]{"GET"}));builder.Metadata.Add(new EndpointNameMetadata("catalog-10"));return (RouteEndpoint)builder.Build();
 }
}
