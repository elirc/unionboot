using static DotnetWeb.W201;
namespace DotnetWeb;
public static class TestsW201 { public static async Task Run() {
 await Task.CompletedTask;
{
  var e=Build();Check.Equal("/catalog1/{id:int}",e.RoutePattern.RawText);Check.Equal(0,e.Order);Check.Equal("catalog-1",e.DisplayName);Check.Equal(new[]{"GET"},e.Metadata.GetMetadata<IHttpMethodMetadata>()!.HttpMethods.ToArray());Check.Equal("catalog-1",e.Metadata.GetMetadata<IEndpointNameMetadata>()!.EndpointName);Check.True(e.Metadata.GetMetadata<IAuthorizeData>() is null);var c=Check.Context();await e.RequestDelegate!(c);Check.Equal("",Check.Body(c));Check.Equal(200,c.Response.StatusCode);
 }
} }
