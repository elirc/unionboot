using static DotnetWeb.W360;
namespace DotnetWeb;
public static class TestsW360{public static async Task Run(){await Task.CompletedTask;
{
using var services=Check.LinkServices("audit","/audit/{id:int}");var gen=services.GetRequiredService<LinkGenerator>();Check.Equal("/v10/audit/7",Resolve(gen,7));Check.Equal("/v10/audit/23",Resolve(gen,23));
}
{
using var services=Check.LinkServices("other","/other/{id}");Check.True(Resolve(services.GetRequiredService<LinkGenerator>(),7) is null);
}
}}
