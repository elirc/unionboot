using static DotnetWeb.W359;
namespace DotnetWeb;
public static class TestsW359{public static async Task Run(){await Task.CompletedTask;
{
using var services=Check.LinkServices("cities","/cities/{id:int}");var gen=services.GetRequiredService<LinkGenerator>();Check.Equal("/v9/cities/7",Resolve(gen,7));Check.Equal("/v9/cities/23",Resolve(gen,23));
}
{
using var services=Check.LinkServices("other","/other/{id}");Check.True(Resolve(services.GetRequiredService<LinkGenerator>(),7) is null);
}
}}
