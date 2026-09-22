using static DotnetWeb.W358;
namespace DotnetWeb;
public static class TestsW358{public static async Task Run(){await Task.CompletedTask;
{
using var services=Check.LinkServices("events","/events/{id:int}");var gen=services.GetRequiredService<LinkGenerator>();Check.Equal("/v8/events/7",Resolve(gen,7));Check.Equal("/v8/events/23",Resolve(gen,23));
}
{
using var services=Check.LinkServices("other","/other/{id}");Check.True(Resolve(services.GetRequiredService<LinkGenerator>(),7) is null);
}
}}
