// W422: Channel worker contracts / Drain channel batches of 2
namespace DotnetWeb;
public static class W422{

public static Task<int> Drain(ChannelReader<int> reader,ICollection<int> sink,CancellationToken token){throw new NotImplementedException("W422");}
}
