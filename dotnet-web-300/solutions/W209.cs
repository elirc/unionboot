// W209: Endpoint route metadata / scenario 9
// GET /catalog9/{id:int}; name catalog-9
// Read prompts/W209.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W209 {

 public static RouteEndpoint Build() {
  var builder=new RouteEndpointBuilder(_=>Task.CompletedTask,RoutePatternFactory.Parse("/catalog9/{id:int}"),0){DisplayName="catalog-9"};builder.Metadata.Add(new HttpMethodMetadata(new[]{"GET"}));builder.Metadata.Add(new EndpointNameMetadata("catalog-9"));return (RouteEndpoint)builder.Build();
 }
}
