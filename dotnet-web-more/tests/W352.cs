using static DotnetWeb.W352;
namespace DotnetWeb;
public static class TestsW352{public static async Task Run(){await Task.CompletedTask;
{
using var services=Check.LinkServices("orders","/orders/{id:int}");var gen=services.GetRequiredService<LinkGenerator>();Check.Equal("/v2/orders/7",Resolve(gen,7));Check.Equal("/v2/orders/23",Resolve(gen,23));
}
{
using var services=Check.LinkServices("other","/other/{id}");Check.True(Resolve(services.GetRequiredService<LinkGenerator>(),7) is null);
}
}}
