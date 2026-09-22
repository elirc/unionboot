using static DotnetWeb.W557;
namespace DotnetWeb;
public static class TestsW557{public static async Task Run(){await Task.CompletedTask;
{
Check.Equal(new[]{"audit-7","common"},Tags(typeof(Handlers).GetMethod(nameof(Handlers.Tagged))!));Check.Equal(Array.Empty<string>(),Tags(typeof(Handlers).GetMethod(nameof(Handlers.Plain))!));
}
{
Check.Equal(new[]{"alternate"},Tags(typeof(Handlers).GetMethod(nameof(Handlers.Other))!));
}
}}
