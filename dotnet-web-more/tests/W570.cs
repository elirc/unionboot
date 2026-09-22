using static DotnetWeb.W570;
namespace DotnetWeb;
public static class TestsW570{public static async Task Run(){await Task.CompletedTask;
{
using var services=new ServiceCollection().AddLogging().AddRouting().BuildServiceProvider();var host=new RouteHost(services);var called=0;Func<int,IResult> handler=id=>{called++;return Results.Ok(id);};var group=Register(host,handler);Check.True(group is not null);var endpoints=host.DataSources.SelectMany(x=>x.Endpoints).OfType<RouteEndpoint>().ToArray();Check.Equal(1,endpoints.Length);Check.Equal("/api/v10/items/{id:int}",endpoints[0].RoutePattern.RawText);Check.Equal("items-v10",endpoints[0].Metadata.GetMetadata<IEndpointNameMetadata>()!.EndpointName);Check.True(endpoints[0].Metadata.GetMetadata<IHttpMethodMetadata>()!.HttpMethods.Contains("GET"));Check.Equal(0,called);
}
}}
