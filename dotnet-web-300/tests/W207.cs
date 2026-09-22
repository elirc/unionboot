using static DotnetWeb.W207;
namespace DotnetWeb;
public static class TestsW207 { public static async Task Run() {
 await Task.CompletedTask;
{
  var e=Build();Check.Equal("/catalog7/{id:int}",e.RoutePattern.RawText);Check.Equal(0,e.Order);Check.Equal("catalog-7",e.DisplayName);Check.Equal(new[]{"GET"},e.Metadata.GetMetadata<IHttpMethodMetadata>()!.HttpMethods.ToArray());Check.Equal("catalog-7",e.Metadata.GetMetadata<IEndpointNameMetadata>()!.EndpointName);Check.True(e.Metadata.GetMetadata<IAuthorizeData>() is null);var c=Check.Context();await e.RequestDelegate!(c);Check.Equal("",Check.Body(c));Check.Equal(200,c.Response.StatusCode);
 }
} }
