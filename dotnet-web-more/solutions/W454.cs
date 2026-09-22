// W454: Options post-configure validation / Normalize then validate multiplier 5
namespace DotnetWeb;
public static class W454{
public sealed class Settings{public int Limit{get;set;}}
public static ServiceProvider Configure(int initial){
var services=new ServiceCollection();services.AddOptions<Settings>().Configure(o=>o.Limit=initial).PostConfigure(o=>{if(o.Limit==0)o.Limit=1;o.Limit*=5;}).Validate(o=>o.Limit>0&&o.Limit<=50,"limit outside range");return services.BuildServiceProvider();
}
}
